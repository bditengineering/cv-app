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
        "*, projects(*), titles(name), educations(*), certifications(certificate_name, description), cv_skill(*)",
      )
      .eq("id", cvId);

  3. call savePdf(response.data)
*/

import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export async function savePdf(data) {
  const [employee] = data;

  const name = `${employee.first_name} - Software Developer`;

  const projects = employee.projects.map((item) => {
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
    return [
      ["Project Name", item.name],
      ["Project Description", item.description],
      ["Field", item.field],
      ["Size of the team", item.team_size],
      ["Position", item.position],
      ["Tools & Technologies", item.technologies.join(", ")],
      ["Responsibilities", item.responsibilities.join(", ")],
      ["Time Period", `${startDate} - ${endDate}`],
    ];
  });

  const education = employee.educations.map(
    (item) =>
      `${item.university_name}\n${item.degree}\n${item.start_year} - ${item.end_year}`,
  );

  const certifications = employee.certifications.map(
    (item) => `${item.certificate_name} - ${item.description}`,
  );

  const doc = new jsPDF();

  const width = doc.internal.pageSize.getWidth();

  const headerFontColor = [67, 67, 67];
  const cellBodyTextColor = [95, 95, 95];
  const backgroundColor = [240, 240, 240];
  const borderColor = [215, 215, 215];
  const borderWidth = 0.3;
  const cellPadding = 3;

  const tableStyles = {
    theme: "grid",
    tableLineColor: borderColor,
    tableLineWidth: borderWidth,
    styles: {
      lineColor: borderColor,
      lineWidth: borderWidth,
    },
    headStyles: {
      fillColor: backgroundColor,
      fontSize: 12,
      fontStyle: "normal",
      halign: "center",
      textColor: headerFontColor,
    },
    bodyStyles: {
      textColor: cellBodyTextColor,
      cellPadding,
    },
    columnStyles: { 0: { textColor: 95, fontStyle: "bold" } },
    pageBreak: "auto",
    margin: { left: 25, right: 25 },
  };

  doc.setTextColor(95, 95, 95);
  doc.setFont("helvetica", "bold");

  doc.text(`${name}`, width / 2, 32, {
    align: "center",
  });

  doc.setTextColor(0, 0, 0);
  doc.setFont("helvetica", "normal");

  autoTable(doc, {
    ...tableStyles,
    columnStyles: {},
    head: [["Summary of Qualification"]],
    body: [[employee.summary || ""]],
    margin: { ...tableStyles.margin, top: 40 },
  });

  autoTable(doc, {
    ...tableStyles,
    head: [
      [
        {
          content: "Technical Skills",
          colSpan: 2,
        },
      ],
    ],
    body: [
      ["Programming languages", employee.programming_languages],
      ["Libs & Frameworks", employee.libs_and_frameworks],
      ["Big Data", employee.big_data],
      ["Databases", employee.databases],
      ["Dev Ops", employee.devops],
    ],
  });

  autoTable(doc, {
    ...tableStyles,
    bodyStyles: {
      ...tableStyles.bodyStyles,
      lineWidth: 0,
    },
    columnStyles: {
      0: {
        lineWidth: { right: borderWidth },
        textColor: 95,
        fontStyle: "bold",
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
    body: projects.flat().slice(0, -1),
    willDrawCell: function (data) {
      if (data.section === "body") {
        const rowIndex = data.row.index;
        if (
          rowIndex !== 0 &&
          rowIndex % 7 === 0 &&
          rowIndex !== projects.length * 7
        ) {
          // draw a border around the last item in the body array
          data.row.cells[0].styles.lineWidth = { right: 0.3, bottom: 0.3 };
          data.row.cells[1].styles.lineWidth = { right: 0.3, bottom: 0.3 };
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
    body: [
      ["University degree", education.join("\n\n")],
      [
        "Level of English \nSpoken \nWritten",
        `\n${employee.english_spoken_level}\n${employee.english_written_level}`,
      ],
      ["Certifications", certifications.join("\n")],
    ],
  });

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

  const uploadName = `${employee.first_name} - Software Developer`;

  return doc.save(uploadName);
}
