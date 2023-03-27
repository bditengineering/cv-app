// helper function for testing the saved PDF locally

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
      [{ content: "", colSpan: 2 }],
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
      textColor: 0,
    },
    bodyStyles: {
      textColor: cellBodyTextColor,
      cellPadding,
    },
    columnStyles: { 0: { textColor: 95, fontStyle: "bold" } },
    pageBreak: "avoid",
    margin: { left: 25, right: 25 },
  };

  doc.setTextColor(95, 95, 95);
  doc.setFont("times", "bold");

  doc.text(`${name}`, width / 2, 32, {
    align: "center",
  });

  doc.setTextColor(0, 0, 0);
  doc.setFont("times", "normal");

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
    head: [
      [
        {
          content: "Projects",
          colSpan: 2,
        },
      ],
    ],
    body: projects.flat().slice(0, -1),
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
