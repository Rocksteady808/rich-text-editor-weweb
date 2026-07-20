export default {
  editor: {
    label: {
      en: "Rich Text",
    },
  },
  properties: {
    text: {
      label: {
        en: "Content (HTML)",
      },
      type: "Text",
      bindable: true,
      multiline: true,
      defaultValue: "<p>Type or paste your content in the HTML Source box above, or use the toolbar buttons.</p>",
      section: "settings",
    },
    // Styling Properties
    textColor: {
      label: {
        en: "Text Color",
      },
      type: "Color",
      section: "style",
      bindable: true,
      responsive: true,
    },
    fontSize: {
      label: {
        en: "Font Size",
      },
      type: "Length",
      section: "style",
      options: {
        unitChoices: [{ value: "px", label: "px", min: 8, max: 100 }],
      },
      responsive: true,
    },
    fontFamily: {
      label: {
        en: "Font Family",
      },
      type: "FontFamily",
      section: "style",
      responsive: true,
    },
    lineHeight: {
      label: {
        en: "Line Height",
      },
      type: "Length",
      section: "style",
      options: {
        unitChoices: [
          { value: "px", label: "px", min: 0, max: 100 },
          { value: "auto", label: "auto" },
        ],
      },
      responsive: true,
    },
    textAlign: {
      label: {
        en: "Text Align",
      },
      type: "TextRadioGroup",
      section: "style",
      options: {
        choices: [
          { value: "left", title: { en: "Left" }, icon: "align-left", default: true },
          { value: "center", title: { en: "Center" }, icon: "align-center" },
          { value: "right", title: { en: "Right" }, icon: "align-right" },
          { value: "justify", title: { en: "Justify" }, icon: "align-justify" },
        ],
      },
      responsive: true,
    },
    backgroundColor: {
      label: {
        en: "Background Color",
      },
      type: "Color",
      section: "style",
      bindable: true,
      responsive: true,
    },
    padding: {
      label: {
        en: "Padding",
      },
      type: "Length",
      section: "style",
      options: {
        unitChoices: [{ value: "px", label: "px", min: 0, max: 100 }],
      },
      responsive: true,
    },
    showBorder: {
      label: {
        en: "Show Border",
      },
      type: "OnOff",
      section: "style",
      defaultValue: false,
    },
    borderWidth: {
      label: {
        en: "Border Width",
      },
      type: "Length",
      section: "style",
      hidden: (content) => !content.showBorder,
      options: {
        unitChoices: [{ value: "px", label: "px", min: 0, max: 20 }],
      },
      defaultValue: "1px",
    },
    borderStyle: {
      label: {
        en: "Border Style",
      },
      type: "TextSelect",
      section: "style",
      hidden: (content) => !content.showBorder,
      options: {
        options: [
          { value: "solid", label: { en: "Solid" } },
          { value: "dashed", label: { en: "Dashed" } },
          { value: "dotted", label: { en: "Dotted" } },
        ],
      },
      defaultValue: "solid",
    },
    borderColor: {
      label: {
        en: "Border Color",
      },
      type: "Color",
      section: "style",
      hidden: (content) => !content.showBorder,
      defaultValue: "#dddddd",
    },
    borderRadius: {
      label: {
        en: "Border Radius",
      },
      type: "Length",
      section: "style",
      options: {
        unitChoices: [{ value: "px", label: "px", min: 0, max: 100 }],
      },
      defaultValue: "0px",
    },
  },
};
