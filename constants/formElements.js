import {
  mdiFormatListBulleted,
  mdiFormSelect,
  mdiFormTextbox,
  mdiGestureTapButton,
  mdiOrderBoolAscendingVariant,
  mdiOrderBoolDescending,
  mdiSignatureFreehand,
} from "@mdi/js";

export const FORM_TYPES = {
  TEXT: "TEXT",
  BUTTON: "BUTTON",
  SIGNATURE: "SIGNATURE",
  RADIO: "RADIO",
  CHECKBOX: "CHECKBOX",
  LISTBOX: "LISTBOX",
  COMBOBOX: "COMBOBOX",
};

const formElements = [
  {
    label: "Button",
    icon: mdiGestureTapButton,
    type: FORM_TYPES.BUTTON,
    constructor(PSPDFKit) {
      return PSPDFKit.FormFields.ButtonFormField;
    },
    config: {
      label: true,
      options: false,
    },
  },
  {
    label: "Text Input",
    icon: mdiFormTextbox,
    type: FORM_TYPES.TEXT,
    constructor(PSPDFKit) {
      return PSPDFKit.FormFields.TextFormField;
    },
    config: {
      label: false,
      options: false,
    },
  },
  {
    label: "Signature Input",
    icon: mdiSignatureFreehand,
    type: FORM_TYPES.SIGNATURE,
    constructor(PSPDFKit) {
      return PSPDFKit.FormFields.SignatureFormField;
    },
    config: {
      label: false,
      options: false,
    },
  },
  {
    label: "Radio Button",
    icon: mdiOrderBoolDescending,
    type: FORM_TYPES.RADIO,
    constructor(PSPDFKit) {
      return PSPDFKit.FormFields.RadioButtonFormField;
    },
    config: {
      label: false,
      options: true,
    },
    options: [
      {
        value: "Value 1",
        label: "Label 1",
      },
    ],
  },
  {
    label: "Checkbox Button",
    icon: mdiOrderBoolAscendingVariant,
    type: FORM_TYPES.CHECKBOX,
    constructor(PSPDFKit) {
      return PSPDFKit.FormFields.CheckBoxFormField;
    },
    config: {
      label: false,
      options: true,
    },
    options: [
      {
        value: "Value 1",
        label: "Label 1",
      },
    ],
  },
  {
    label: "List Box",
    icon: mdiFormatListBulleted,
    type: FORM_TYPES.LISTBOX,
    constructor(PSPDFKit) {
      return PSPDFKit.FormFields.ListBoxFormField;
    },
    config: {
      label: false,
      options: true,
    },
    options: [
      {
        value: "Value 1",
        label: "Label 1",
      },
      {
        value: "Value 2",
        label: "Label 2",
      },
    ],
  },
  {
    label: "Combo Box",
    icon: mdiFormSelect,
    type: FORM_TYPES.COMBOBOX,
    constructor(PSPDFKit) {
      return PSPDFKit.FormFields.ComboBoxFormField;
    },
    config: {
      label: false,
      options: true,
    },
    options: [
      {
        value: "Value 1",
        label: "Label 1",
      },
      {
        value: "Value 2",
        label: "Label 2",
      },
    ],
  },
];

export default formElements;
