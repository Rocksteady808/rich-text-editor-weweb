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
          defaultValue: { name: "New Page", path: "/", sections: [] },
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
              sections: {
                label: { en: "Sections (optional)" },
                type: "Array",
                options: {
                  expandable: true,
                  getItemLabel(item) {
                    return item?.name || "Section";
                  },
                  item: {
                    type: "Object",
                    defaultValue: { name: "New Section", anchor: "section-id" },
                    options: {
                      item: {
                        name: {
                          label: { en: "Name" },
                          type: "Text",
                        },
                        anchor: {
                          label: { en: "Anchor ID" },
                          type: "Text",
                        },
                      },
                    },
                  },
                },
                defaultValue: [],
              },
            },
          },
        },
      },
      defaultValue: [
        { name: "Home", path: "/home", sections: [] },
        { name: "Papers", path: "/papers", sections: [] },
        { name: "Tips", path: "/tips", sections: [] },
        { name: "Cones", path: "/cones", sections: [] },
        { name: "Accessories", path: "/accessories", sections: [] },
        { name: "Lifestyle", path: "/lifestyle", sections: [] },
        { name: "Distributors", path: "/distributors", sections: [] },
        { name: "Medical Marijuana", path: "/medical-marijuana", sections: [] },
        { name: "Brand Protection", path: "/brand-protection", sections: [] },
        { name: "Privacy Policy", path: "/privacy-policy", sections: [] },
        { name: "California Proposition 65 Warning", path: "/california-proposition-65-warning", sections: [] },
      ],
    },

    // Per-element styling: pick a target, then only that target's controls show
    styleTarget: {
      label: { en: "Style Element" },
      type: "TextSelect",
      section: "style",
      options: {
        options: [
          { value: "base", label: { en: "Default (all text)" } },
          { value: "paragraph", label: { en: "Paragraph" } },
          { value: "heading1", label: { en: "Heading 1" } },
          { value: "heading2", label: { en: "Heading 2" } },
          { value: "heading3", label: { en: "Heading 3" } },
          { value: "heading4", label: { en: "Heading 4" } },
          { value: "heading5", label: { en: "Heading 5" } },
          { value: "heading6", label: { en: "Heading 6" } },
          { value: "link", label: { en: "Link" } },
          { value: "list", label: { en: "List" } },
        ],
      },
      defaultValue: "base",
    },

    // Base/fallback styling — applies to any element type without its own override below
    textColor: {
      label: {
        en: "Text Color",
      },
      type: "Color",
      section: "style",
      bindable: true,
      responsive: true,
      hidden: (content) => content.styleTarget !== "base",
    },
    fontSize: {
      label: {
        en: "Font Size",
      },
      type: "Length",
      section: "style",
      options: {
        unitChoices: [
          { value: "px", label: "px", min: 8, max: 100 },
          { value: "rem", label: "rem", min: 0.5, max: 6 },
          { value: "em", label: "em", min: 0.5, max: 6 },
        ],
      },
      defaultValue: "16px",
      responsive: true,
      hidden: (content) => content.styleTarget !== "base",
    },
    fontFamily: {
      label: {
        en: "Font Family",
      },
      type: "FontFamily",
      section: "style",
      responsive: true,
      hidden: (content) => content.styleTarget !== "base",
    },
    fontWeight: {
      label: { en: "Font Weight" },
      type: "TextSelect",
      section: "style",
      options: {
        options: [
          { value: "", label: { en: "Default" } },
          { value: "300", label: { en: "Light" } },
          { value: "400", label: { en: "Normal" } },
          { value: "500", label: { en: "Medium" } },
          { value: "600", label: { en: "Semi Bold" } },
          { value: "700", label: { en: "Bold" } },
          { value: "800", label: { en: "Extra Bold" } },
        ],
      },
      hidden: (content) => content.styleTarget !== "base",
    },
    lineHeight: {
      label: {
        en: "Line Height",
      },
      type: "Length",
      section: "style",
      options: {
        unitChoices: [
          { value: "auto", label: "auto" },
          { value: "px", label: "px", min: 0, max: 100 },
          { value: "%", label: "%", min: 0, max: 300 },
          { value: "em", label: "em", min: 0, max: 6 },
          { value: "rem", label: "rem", min: 0, max: 6 },
          { value: "none", label: "none" },
        ],
      },
      defaultValue: "auto",
      responsive: true,
      hidden: (content) => content.styleTarget !== "base",
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

    paragraphColor: {
      label: { en: "Paragraph Color" },
      type: "Color",
      section: "style",
      bindable: true,
      responsive: true,
      hidden: (content) => content.styleTarget !== "paragraph",
    },
    paragraphFontSize: {
      label: { en: "Paragraph Font Size" },
      type: "Length",
      section: "style",
      options: {
        unitChoices: [
          { value: "px", label: "px", min: 8, max: 100 },
          { value: "rem", label: "rem", min: 0.5, max: 6 },
          { value: "em", label: "em", min: 0.5, max: 6 },
        ],
      },
      defaultValue: "16px",
      responsive: true,
      hidden: (content) => content.styleTarget !== "paragraph",
    },
    paragraphFontFamily: {
      label: { en: "Paragraph Font Family" },
      type: "FontFamily",
      section: "style",
      responsive: true,
      hidden: (content) => content.styleTarget !== "paragraph",
    },
    paragraphFontWeight: {
      label: { en: "Paragraph Font Weight" },
      type: "TextSelect",
      section: "style",
      options: {
        options: [
          { value: "", label: { en: "Default" } },
          { value: "300", label: { en: "Light" } },
          { value: "400", label: { en: "Normal" } },
          { value: "500", label: { en: "Medium" } },
          { value: "600", label: { en: "Semi Bold" } },
          { value: "700", label: { en: "Bold" } },
          { value: "800", label: { en: "Extra Bold" } },
        ],
      },
      hidden: (content) => content.styleTarget !== "paragraph",
    },

    heading1Color: {
      label: { en: "Heading 1 Color" },
      type: "Color",
      section: "style",
      bindable: true,
      responsive: true,
      hidden: (content) => content.styleTarget !== "heading1",
    },
    heading1FontSize: {
      label: { en: "Heading 1 Font Size" },
      type: "Length",
      section: "style",
      options: {
        unitChoices: [
          { value: "px", label: "px", min: 8, max: 120 },
          { value: "rem", label: "rem", min: 0.5, max: 8 },
          { value: "em", label: "em", min: 0.5, max: 8 },
        ],
      },
      defaultValue: "32px",
      responsive: true,
      hidden: (content) => content.styleTarget !== "heading1",
    },
    heading1FontFamily: {
      label: { en: "Heading 1 Font Family" },
      type: "FontFamily",
      section: "style",
      responsive: true,
      hidden: (content) => content.styleTarget !== "heading1",
    },
    heading1FontWeight: {
      label: { en: "Heading 1 Font Weight" },
      type: "TextSelect",
      section: "style",
      options: {
        options: [
          { value: "", label: { en: "Default" } },
          { value: "300", label: { en: "Light" } },
          { value: "400", label: { en: "Normal" } },
          { value: "500", label: { en: "Medium" } },
          { value: "600", label: { en: "Semi Bold" } },
          { value: "700", label: { en: "Bold" } },
          { value: "800", label: { en: "Extra Bold" } },
        ],
      },
      hidden: (content) => content.styleTarget !== "heading1",
    },

    heading2Color: {
      label: { en: "Heading 2 Color" },
      type: "Color",
      section: "style",
      bindable: true,
      responsive: true,
      hidden: (content) => content.styleTarget !== "heading2",
    },
    heading2FontSize: {
      label: { en: "Heading 2 Font Size" },
      type: "Length",
      section: "style",
      options: {
        unitChoices: [
          { value: "px", label: "px", min: 8, max: 120 },
          { value: "rem", label: "rem", min: 0.5, max: 8 },
          { value: "em", label: "em", min: 0.5, max: 8 },
        ],
      },
      defaultValue: "24px",
      responsive: true,
      hidden: (content) => content.styleTarget !== "heading2",
    },
    heading2FontFamily: {
      label: { en: "Heading 2 Font Family" },
      type: "FontFamily",
      section: "style",
      responsive: true,
      hidden: (content) => content.styleTarget !== "heading2",
    },
    heading2FontWeight: {
      label: { en: "Heading 2 Font Weight" },
      type: "TextSelect",
      section: "style",
      options: {
        options: [
          { value: "", label: { en: "Default" } },
          { value: "300", label: { en: "Light" } },
          { value: "400", label: { en: "Normal" } },
          { value: "500", label: { en: "Medium" } },
          { value: "600", label: { en: "Semi Bold" } },
          { value: "700", label: { en: "Bold" } },
          { value: "800", label: { en: "Extra Bold" } },
        ],
      },
      hidden: (content) => content.styleTarget !== "heading2",
    },

    heading3Color: {
      label: { en: "Heading 3 Color" },
      type: "Color",
      section: "style",
      bindable: true,
      responsive: true,
      hidden: (content) => content.styleTarget !== "heading3",
    },
    heading3FontSize: {
      label: { en: "Heading 3 Font Size" },
      type: "Length",
      section: "style",
      options: {
        unitChoices: [
          { value: "px", label: "px", min: 8, max: 120 },
          { value: "rem", label: "rem", min: 0.5, max: 8 },
          { value: "em", label: "em", min: 0.5, max: 8 },
        ],
      },
      defaultValue: "20px",
      responsive: true,
      hidden: (content) => content.styleTarget !== "heading3",
    },
    heading3FontFamily: {
      label: { en: "Heading 3 Font Family" },
      type: "FontFamily",
      section: "style",
      responsive: true,
      hidden: (content) => content.styleTarget !== "heading3",
    },
    heading3FontWeight: {
      label: { en: "Heading 3 Font Weight" },
      type: "TextSelect",
      section: "style",
      options: {
        options: [
          { value: "", label: { en: "Default" } },
          { value: "300", label: { en: "Light" } },
          { value: "400", label: { en: "Normal" } },
          { value: "500", label: { en: "Medium" } },
          { value: "600", label: { en: "Semi Bold" } },
          { value: "700", label: { en: "Bold" } },
          { value: "800", label: { en: "Extra Bold" } },
        ],
      },
      hidden: (content) => content.styleTarget !== "heading3",
    },

    heading4Color: {
      label: { en: "Heading 4 Color" },
      type: "Color",
      section: "style",
      bindable: true,
      responsive: true,
      hidden: (content) => content.styleTarget !== "heading4",
    },
    heading4FontSize: {
      label: { en: "Heading 4 Font Size" },
      type: "Length",
      section: "style",
      options: {
        unitChoices: [
          { value: "px", label: "px", min: 8, max: 120 },
          { value: "rem", label: "rem", min: 0.5, max: 8 },
          { value: "em", label: "em", min: 0.5, max: 8 },
        ],
      },
      defaultValue: "18px",
      responsive: true,
      hidden: (content) => content.styleTarget !== "heading4",
    },
    heading4FontFamily: {
      label: { en: "Heading 4 Font Family" },
      type: "FontFamily",
      section: "style",
      responsive: true,
      hidden: (content) => content.styleTarget !== "heading4",
    },
    heading4FontWeight: {
      label: { en: "Heading 4 Font Weight" },
      type: "TextSelect",
      section: "style",
      options: {
        options: [
          { value: "", label: { en: "Default" } },
          { value: "300", label: { en: "Light" } },
          { value: "400", label: { en: "Normal" } },
          { value: "500", label: { en: "Medium" } },
          { value: "600", label: { en: "Semi Bold" } },
          { value: "700", label: { en: "Bold" } },
          { value: "800", label: { en: "Extra Bold" } },
        ],
      },
      hidden: (content) => content.styleTarget !== "heading4",
    },

    heading5Color: {
      label: { en: "Heading 5 Color" },
      type: "Color",
      section: "style",
      bindable: true,
      responsive: true,
      hidden: (content) => content.styleTarget !== "heading5",
    },
    heading5FontSize: {
      label: { en: "Heading 5 Font Size" },
      type: "Length",
      section: "style",
      options: {
        unitChoices: [
          { value: "px", label: "px", min: 8, max: 120 },
          { value: "rem", label: "rem", min: 0.5, max: 8 },
          { value: "em", label: "em", min: 0.5, max: 8 },
        ],
      },
      defaultValue: "16px",
      responsive: true,
      hidden: (content) => content.styleTarget !== "heading5",
    },
    heading5FontFamily: {
      label: { en: "Heading 5 Font Family" },
      type: "FontFamily",
      section: "style",
      responsive: true,
      hidden: (content) => content.styleTarget !== "heading5",
    },
    heading5FontWeight: {
      label: { en: "Heading 5 Font Weight" },
      type: "TextSelect",
      section: "style",
      options: {
        options: [
          { value: "", label: { en: "Default" } },
          { value: "300", label: { en: "Light" } },
          { value: "400", label: { en: "Normal" } },
          { value: "500", label: { en: "Medium" } },
          { value: "600", label: { en: "Semi Bold" } },
          { value: "700", label: { en: "Bold" } },
          { value: "800", label: { en: "Extra Bold" } },
        ],
      },
      hidden: (content) => content.styleTarget !== "heading5",
    },

    heading6Color: {
      label: { en: "Heading 6 Color" },
      type: "Color",
      section: "style",
      bindable: true,
      responsive: true,
      hidden: (content) => content.styleTarget !== "heading6",
    },
    heading6FontSize: {
      label: { en: "Heading 6 Font Size" },
      type: "Length",
      section: "style",
      options: {
        unitChoices: [
          { value: "px", label: "px", min: 8, max: 120 },
          { value: "rem", label: "rem", min: 0.5, max: 8 },
          { value: "em", label: "em", min: 0.5, max: 8 },
        ],
      },
      defaultValue: "14px",
      responsive: true,
      hidden: (content) => content.styleTarget !== "heading6",
    },
    heading6FontFamily: {
      label: { en: "Heading 6 Font Family" },
      type: "FontFamily",
      section: "style",
      responsive: true,
      hidden: (content) => content.styleTarget !== "heading6",
    },
    heading6FontWeight: {
      label: { en: "Heading 6 Font Weight" },
      type: "TextSelect",
      section: "style",
      options: {
        options: [
          { value: "", label: { en: "Default" } },
          { value: "300", label: { en: "Light" } },
          { value: "400", label: { en: "Normal" } },
          { value: "500", label: { en: "Medium" } },
          { value: "600", label: { en: "Semi Bold" } },
          { value: "700", label: { en: "Bold" } },
          { value: "800", label: { en: "Extra Bold" } },
        ],
      },
      hidden: (content) => content.styleTarget !== "heading6",
    },

    linkColor: {
      label: { en: "Link Color" },
      type: "Color",
      section: "style",
      bindable: true,
      responsive: true,
      hidden: (content) => content.styleTarget !== "link",
    },
    linkFontWeight: {
      label: { en: "Link Font Weight" },
      type: "TextSelect",
      section: "style",
      options: {
        options: [
          { value: "", label: { en: "Default" } },
          { value: "300", label: { en: "Light" } },
          { value: "400", label: { en: "Normal" } },
          { value: "500", label: { en: "Medium" } },
          { value: "600", label: { en: "Semi Bold" } },
          { value: "700", label: { en: "Bold" } },
          { value: "800", label: { en: "Extra Bold" } },
        ],
      },
      hidden: (content) => content.styleTarget !== "link",
    },
    linkFontSize: {
      label: { en: "Link Font Size" },
      type: "Length",
      section: "style",
      options: {
        unitChoices: [
          { value: "px", label: "px", min: 8, max: 100 },
          { value: "rem", label: "rem", min: 0.5, max: 6 },
          { value: "em", label: "em", min: 0.5, max: 6 },
        ],
      },
      defaultValue: "16px",
      responsive: true,
      hidden: (content) => content.styleTarget !== "link",
    },
    linkUnderline: {
      label: { en: "Underline Links" },
      type: "OnOff",
      section: "style",
      defaultValue: true,
      hidden: (content) => content.styleTarget !== "link",
    },

    listColor: {
      label: { en: "List Color" },
      type: "Color",
      section: "style",
      bindable: true,
      responsive: true,
      hidden: (content) => content.styleTarget !== "list",
    },
    listFontSize: {
      label: { en: "List Font Size" },
      type: "Length",
      section: "style",
      options: {
        unitChoices: [
          { value: "px", label: "px", min: 8, max: 100 },
          { value: "rem", label: "rem", min: 0.5, max: 6 },
          { value: "em", label: "em", min: 0.5, max: 6 },
        ],
      },
      defaultValue: "16px",
      responsive: true,
      hidden: (content) => content.styleTarget !== "list",
    },
    listFontFamily: {
      label: { en: "List Font Family" },
      type: "FontFamily",
      section: "style",
      responsive: true,
      hidden: (content) => content.styleTarget !== "list",
    },
    listFontWeight: {
      label: { en: "List Font Weight" },
      type: "TextSelect",
      section: "style",
      options: {
        options: [
          { value: "", label: { en: "Default" } },
          { value: "300", label: { en: "Light" } },
          { value: "400", label: { en: "Normal" } },
          { value: "500", label: { en: "Medium" } },
          { value: "600", label: { en: "Semi Bold" } },
          { value: "700", label: { en: "Bold" } },
          { value: "800", label: { en: "Extra Bold" } },
        ],
      },
      hidden: (content) => content.styleTarget !== "list",
    },
  },
};
