import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle } from "docx";
import { CVData } from "../types";

export const generateDocx = async (data: CVData): Promise<Blob> => {
  const { personalInfo, experience, education, skills, projects, customSections } = data;

  const sections = [];

  // --- Header (Name & Contact) ---
  const header = [
    new Paragraph({
      text: personalInfo.fullName.toUpperCase(),
      heading: HeadingLevel.HEADING_1,
      alignment: AlignmentType.CENTER,
      spacing: { after: 100 },
    }),
    new Paragraph({
      text: personalInfo.jobTitle,
      heading: HeadingLevel.HEADING_2,
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({ text: personalInfo.email }),
        new TextRun({ text: " | " }),
        new TextRun({ text: personalInfo.phone }),
        new TextRun({ text: " | " }),
        new TextRun({ text: personalInfo.location }),
      ],
      spacing: { after: 300 },
    }),
  ];

  if(personalInfo.linkedin || personalInfo.website) {
    header.push(new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({ text: personalInfo.linkedin || "" }),
        new TextRun({ text: (personalInfo.linkedin && personalInfo.website) ? " | " : "" }),
        new TextRun({ text: personalInfo.website || "" }),
      ],
      spacing: { after: 300 },
    }));
  }

  // --- Summary ---
  if (personalInfo.summary) {
    sections.push(
      new Paragraph({
        text: "Professional Summary",
        heading: HeadingLevel.HEADING_3,
        border: { bottom: { color: "auto", space: 1, value: BorderStyle.SINGLE, size: 6 } },
        spacing: { before: 200, after: 100 },
      }),
      new Paragraph({
        text: personalInfo.summary,
        spacing: { after: 200 },
      })
    );
  }

  // --- Experience ---
  if (experience.length > 0) {
    sections.push(
      new Paragraph({
        text: "Experience",
        heading: HeadingLevel.HEADING_3,
        border: { bottom: { color: "auto", space: 1, value: BorderStyle.SINGLE, size: 6 } },
        spacing: { before: 200, after: 100 },
      })
    );

    experience.forEach(exp => {
      sections.push(
        new Paragraph({
            children: [
                new TextRun({ text: exp.role, bold: true, size: 24 }),
            ],
            spacing: { before: 100 },
        }),
        new Paragraph({
            children: [
                new TextRun({ text: exp.company, bold: true }),
                new TextRun({ text: ` | ${exp.startDate} - ${exp.isCurrent ? "Present" : exp.endDate}` }),
                new TextRun({ text: ` | ${exp.location}` }),
            ],
            spacing: { after: 100 },
        }),
        new Paragraph({
            text: exp.description,
            spacing: { after: 200 },
        })
      );
    });
  }

  // --- Education ---
  if (education.length > 0) {
    sections.push(
      new Paragraph({
        text: "Education",
        heading: HeadingLevel.HEADING_3,
        border: { bottom: { color: "auto", space: 1, value: BorderStyle.SINGLE, size: 6 } },
        spacing: { before: 200, after: 100 },
      })
    );

    education.forEach(edu => {
      sections.push(
        new Paragraph({
            children: [
                new TextRun({ text: edu.school, bold: true, size: 24 }),
            ],
            spacing: { before: 100 },
        }),
        new Paragraph({
            children: [
                new TextRun({ text: `${edu.degree}, ${edu.field}` }),
                new TextRun({ text: ` | ${edu.startDate} - ${edu.endDate}` }),
            ],
            spacing: { after: 200 },
        })
      );
    });
  }

  // --- Skills ---
  if (skills.length > 0) {
    sections.push(
      new Paragraph({
        text: "Skills",
        heading: HeadingLevel.HEADING_3,
        border: { bottom: { color: "auto", space: 1, value: BorderStyle.SINGLE, size: 6 } },
        spacing: { before: 200, after: 100 },
      }),
      new Paragraph({
        text: skills.map(s => s.name).join(", "),
        spacing: { after: 200 },
      })
    );
  }

  // --- Custom Sections ---
  if (customSections && customSections.length > 0) {
    customSections.forEach(section => {
      if(section.items.length > 0) {
        sections.push(
          new Paragraph({
            text: section.title,
            heading: HeadingLevel.HEADING_3,
            border: { bottom: { color: "auto", space: 1, value: BorderStyle.SINGLE, size: 6 } },
            spacing: { before: 200, after: 100 },
          })
        );
        
        section.items.forEach(item => {
           if(item.title) {
               sections.push(
                new Paragraph({
                    children: [
                        new TextRun({ text: item.title, bold: true }),
                        ...(item.subtitle ? [new TextRun({ text: ` | ${item.subtitle}` })] : [])
                    ],
                    spacing: { before: 100 },
                })
               );
           }
           if(item.description) {
               sections.push(
                 new Paragraph({
                    text: item.description,
                    spacing: { after: 200 },
                 })
               );
           }
        });
      }
    });
  }

  const doc = new Document({
    sections: [{
      properties: {},
      children: [
          ...header,
          ...sections
      ],
    }],
  });

  return await Packer.toBlob(doc);
};