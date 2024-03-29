/* 
  This helper function is created only for testing the PDF locally
  Instead of re-deploying the edgde function everytime, you can use this function to 
  play around the PDF stylings. It will save the PDF to your downloads folder.

  To test it locally:

  1. in add_new_cv_form comment out edgeUploadInvocation usage in handleSubmit function

  2. fetch data from supabase
    const response = await supabase
      .from("cv")
      .select(
        "*, projects(*), titles(name), educations(*), certifications(certificate_name, description), cv_skill(skill(name, skill_group(*)))",
      )
      .eq("id", cvId);

  3. call savePdf(response.data)
*/

import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import "../helpers/fonts/Nunito-normal";
import "../helpers/fonts/Nunito-bold";

const transformSkillsBySkillGroup = (skills) => {
  return skills.reduce((acc, element) => {
    const group_name = element.skill.skill_group.name;

    if (!acc[group_name]) {
      acc[group_name] = [];
    }

    acc[group_name].push(element.skill.name);

    return acc;
  }, {});
};

export async function savePdf(data) {
  const [employee] = data;

  const skills = employee.cv_skill
    ? transformSkillsBySkillGroup(employee.cv_skill)
    : null;

  const name = `${employee.first_name} - Software Developer`;

  const projects = employee.projects.map((item) => {
    let period = null;
    if (item.date_start && item.date_end) {
      const startDate = new Date(item.date_start).toLocaleString("default", {
        month: "long",
        year: "numeric",
      });
      const endDate = item.ongoing
        ? "Present"
        : new Date(item.date_end).toLocaleString("default", {
            month: "long",
            year: "numeric",
          });
      period = `${startDate} - ${endDate}`;
    }

    const projectArray = [["Project Name", item.name]];
    if (item.description) {
      projectArray.push(["Project Description", item.description]);
    }
    if (item.field) {
      projectArray.push(["Field", item.field]);
    }
    if (item.team_size) {
      projectArray.push(["Size of the team", item.team_size]);
    }
    if (item.position) {
      projectArray.push(["Position", item.position]);
    }
    projectArray.push(["Tools & Technologies", item.technologies.join(", ")]);

    if (item.responsibilities && item.responsibilities.length > 0) {
      projectArray.push(["Responsibilities", item.responsibilities.join(", ")]);
    }
    if (period) {
      projectArray.push(["Time Period", period]);
    }
    return projectArray;
  });

  const education = employee.educations.map(
    (item) =>
      `${item.university_name}\n${item.degree}\n${item.start_year} - ${item.end_year}`,
  );
  const certifications = employee.certifications.map(
    (item) => `${item.certificate_name} - ${item.description}`,
  );

  const educationArray = [
    [
      "Level of English \nSpoken \nWritten",
      `\n${employee.english_spoken_level}\n${employee.english_written_level}`,
    ],
  ];

  if (education.length !== 0) {
    educationArray.unshift(["University degree", education.join("\n\n")]);
  }

  if (certifications.length !== 0) {
    educationArray.unshift(["Certifications", certifications.join("\n")]);
  }

  const doc = new jsPDF();

  const width = doc.internal.pageSize.getWidth();

  const DOCUMENT_TITLE_TEXT_SIZE = 16.5;
  const TEXT_COLOR = [67, 67, 67];
  const CELL_TEXT_SIZE = 10.5;
  const HEADER_TEXT_SIZE = 12;
  const TITLE_CELL_WIDTH = 39;
  const TECHNICAL_SKILLS_TITLE_CELL_WIDTH = 49;
  const BACKGROUND_COLOR = [243, 243, 243];
  const BORDER_COLOR = [217, 217, 217];
  const BORDER_WIDTH = 0.3;
  const CELL_PADDING = 3;

  // 'global' table styles
  const tableStyles = {
    theme: "grid",
    tableLineColor: BORDER_COLOR,
    tableLineWidth: BORDER_WIDTH,
    styles: {
      lineColor: BORDER_COLOR,
      lineWidth: BORDER_WIDTH,
      font: "Nunito",
    },
    headStyles: {
      fillColor: BACKGROUND_COLOR,
      fontSize: HEADER_TEXT_SIZE,
      fontStyle: "bold",
      halign: "center",
      textColor: TEXT_COLOR,
    },
    bodyStyles: {
      textColor: TEXT_COLOR,
      cellPadding: CELL_PADDING,
    },
    columnStyles: {
      0: {
        textColor: TEXT_COLOR,
        fontStyle: "bold",
        fontSize: CELL_TEXT_SIZE,
        cellWidth: TITLE_CELL_WIDTH,
      },
    },
    margin: { left: 25, right: 25 },
    rowPageBreak: "avoid",
    showHead: "firstPage",
  };

  doc.setTextColor(67, 67, 67);
  doc.setFont("Nunito", "bold");

  doc.text(`${name}`, width / 2, 32, {
    align: "center",
    fontSize: DOCUMENT_TITLE_TEXT_SIZE,
    fontStyle: "bold",
  });

  doc.setTextColor(0, 0, 0);
  doc.setFont("Nunito", "normal");

  if (employee.summary) {
    autoTable(doc, {
      ...tableStyles,
      columnStyles: {},
      head: [["Summary of Qualification"]],
      body: [[employee.summary]],
      margin: { ...tableStyles.margin, top: 40 },
    });
  }

  if (skills) {
    const skillsBody = [];

    Object.entries(skills).map(([groupName, skills]) => {
      const skillList1 = [];
      const skillList2 = [];

      // separate skills in two columns
      for (let i = 0; i < skills.length; i++) {
        if (i % 2 === 0) {
          skillList1.push(skills[i]);
        } else {
          skillList2.push(skills[i]);
        }
      }

      skillsBody.push([groupName, skillList1, skillList2]);
    });

    autoTable(doc, {
      ...tableStyles,
      columnStyles: {
        0: {
          ...tableStyles.columnStyles[0],
          cellWidth: TECHNICAL_SKILLS_TITLE_CELL_WIDTH,
          lineWidth: { right: BORDER_WIDTH * 2, top: BORDER_WIDTH },
        },
      },
      head: [
        [
          {
            content: "Technical Skills",
            colSpan: 3,
          },
        ],
      ],
      body: skillsBody,
      didParseCell: function (data) {
        // set space between skills after new line
        // doc.setLineHeightFactor(1.5);
        if (Array.isArray(data.cell.raw)) {
          // remove border between two columns in skills body
          data.cell.styles.lineWidth = { top: BORDER_WIDTH };
          data.cell.text = data.cell.raw.map(function (element) {
            return `- ${element}`;
          });
        }
      },
    });
  }

  // doc.setLineHeightFactor(1.15);

  autoTable(doc, {
    ...tableStyles,
    bodyStyles: {
      ...tableStyles.bodyStyles,
      lineWidth: 0,
    },
    columnStyles: {
      0: {
        ...tableStyles.columnStyles[0],
        lineWidth: { right: BORDER_WIDTH * 2 },
      },
    },
    head: [
      [
        {
          content: "Projects",
          colSpan: 2,
        },
      ],
    ],
    body: projects.flat(),
    willDrawCell: function (data) {
      if (data.section === "body") {
        const rowIndex = data.row.index;
        if (
          rowIndex !== 0 &&
          rowIndex % 7 === 0 &&
          rowIndex !== projects.length * 7
        ) {
          // draw a horizontal line (border) between projects
          data.row.cells[0].styles.lineWidth = {
            right: BORDER_WIDTH,
            bottom: BORDER_WIDTH,
          };
          data.row.cells[1].styles.lineWidth = {
            right: BORDER_WIDTH,
            bottom: BORDER_WIDTH,
          };
        }
      }
    },
  });

  autoTable(doc, {
    ...tableStyles,
    head: [
      [
        {
          content: "Education",
          colSpan: 2,
        },
      ],
    ],
    body: educationArray,
  });

  if (employee.personal_qualities?.length !== 0) {
    autoTable(doc, {
      ...tableStyles,
      head: [
        [
          {
            content: "Additional Information",
            colSpan: 2,
          },
        ],
      ],
      body: [["Personal qualities", employee.personal_qualities]],
    });
  }

  const uploadName = `${employee.first_name} - Software Developer`;

  return doc.save(uploadName);
}
