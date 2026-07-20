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
    pages: {
      label: {
        en: "Pages (for Link dropdown)",
      },
      type: "Array",
      section: "settings",
      bindable: true,
      options: {
        expandable: true,
        getItemLabel(item) {
          return item?.name || "Page";
        },
        item: {
          type: "Object",
          defaultValue: { name: "New Page", path: "/" },
          options: {
            item: {
              name: {
                label: { en: "Name" },
                type: "Text",
              },
              path: {
                label: { en: "Path" },
                type: "Text",
              },
            },
          },
        },
      },
      defaultValue: [
        { name: "Home", path: "/home" },
        { name: "Papers", path: "/papers" },
        { name: "Tips", path: "/tips" },
        { name: "Cones", path: "/cones" },
        { name: "Accessories", path: "/accessories" },
        { name: "Lifestyle", path: "/lifestyle" },
        { name: "Distributors", path: "/distributors" },
        { name: "Medical Marijuana", path: "/medical-marijuana" },
        { name: "Brand Protection", path: "/brand-protection" },
        { name: "Privacy Policy", path: "/privacy-policy" },
        { name: "California Proposition 65 Warning", path: "/california-proposition-65-warning" },
      ],
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
