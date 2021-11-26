import { FORM_TYPES } from "../constants/formElements";

export default async function createWidgetAnnotation(
  instance,
  { type, options, label },
  PSPDFKit,
  data,
  coordinates
) {
  const formFieldName = data?.name || `${type}-${PSPDFKit.generateInstantId()}`;

  const widgetProperties = {
    id: PSPDFKit.generateInstantId(),
    pageIndex: instance.viewState.currentPageIndex,
    formFieldName,
  };

  if (!coordinates) {
    const pageInfo = await instance.pageInfoForIndex(
      instance.viewState.currentPageIndex
    );

    coordinates = { x: pageInfo.width / 2, y: pageInfo.height / 3 };
  }

  if (!data?.options?.length) {
    if (!data) data = {}
    data.options = options;
  }

  const { x, y } = coordinates;

  switch (type) {
    case FORM_TYPES.TEXT: {
      const [width, height] = [226, 16];

      const widget = new PSPDFKit.Annotations.WidgetAnnotation({
        ...widgetProperties,
        borderColor: PSPDFKit.Color.BLACK,
        borderWidth: 1,
        borderStyle: "solid",
        backgroundColor: new PSPDFKit.Color({ r: 220, g: 240, b: 255 }),
        boundingBox: new PSPDFKit.Geometry.Rect({
          left: Math.max(x - width / 2, 0),
          top: Math.max(0, y - height / 2),
          width,
          height,
        }),
      });

      const formField = new PSPDFKit.FormFields.TextFormField({
        name: formFieldName,
        annotationIds: new PSPDFKit.Immutable.List([widget.id]),
      });

      await instance.create([widget, formField]);
      break;
    }

    case FORM_TYPES.SIGNATURE: {
      const [width, height] = [226, 30];

      const widget = new PSPDFKit.Annotations.WidgetAnnotation({
        ...widgetProperties,
        borderColor: PSPDFKit.Color.BLACK,
        borderWidth: 1,
        borderStyle: "solid",
        backgroundColor: PSPDFKit.Color.WHITE,
        boundingBox: new PSPDFKit.Geometry.Rect({
          left: Math.max(x - width / 2, 0),
          top: Math.max(0, y - height / 2),
          width,
          height,
        }),
      });

      const formField = new PSPDFKit.FormFields.SignatureFormField({
        name: formFieldName,
        annotationIds: new PSPDFKit.Immutable.List([widget.id]),
      });

      await instance.create([widget, formField]);
      break;
    }

    case FORM_TYPES.RADIO: {
      const [width, height] = [30, 30];

      const widgets = data.options?.map(
        () =>
          new PSPDFKit.Annotations.WidgetAnnotation({
            ...widgetProperties,
            id: PSPDFKit.generateInstantId(),
            formFieldName,
            borderColor: PSPDFKit.Color.BLACK,
            borderWidth: 1,
            borderStyle: "solid",
            backgroundColor: PSPDFKit.Color.WHITE,
            boundingBox: new PSPDFKit.Geometry.Rect({
              left: Math.max(x - width / 2, 0),
              top: Math.max(0, y - height / 2),
              width,
              height,
            }),
          })
      );

      const formField = new PSPDFKit.FormFields.RadioButtonFormField({
        name: formFieldName,
        annotationIds: new PSPDFKit.Immutable.List(
          widgets.map((widget) => widget.id)
        ),
        options: new PSPDFKit.Immutable.List(
          data.options?.map(
            (option) =>
              new PSPDFKit.FormOption({
                label: option.label || option.value,
                value: option.value,
              })
          )
        ),
        defaultValue: data.options?.[0].value,
      });

      await instance.create([...widgets, formField]);
      break;
    }

    case FORM_TYPES.CHECKBOX: {
      const [width, height] = [30, 30];

      const widgets = data.options?.map(
        () =>
          new PSPDFKit.Annotations.WidgetAnnotation({
            ...widgetProperties,
            id: PSPDFKit.generateInstantId(),
            formFieldName,
            borderColor: PSPDFKit.Color.BLACK,
            borderWidth: 1,
            borderStyle: "solid",
            backgroundColor: PSPDFKit.Color.WHITE,
            boundingBox: new PSPDFKit.Geometry.Rect({
              left: Math.max(x - width / 2, 0),
              top: Math.max(0, y - height / 2),
              width,
              height,
            }),
          })
      );

      const formField = new PSPDFKit.FormFields.CheckBoxFormField({
        name: formFieldName,
        annotationIds: new PSPDFKit.Immutable.List(
          widgets.map((widget) => widget.id)
        ),
        options: new PSPDFKit.Immutable.List(
          data.options?.map(
            (option) =>
              new PSPDFKit.FormOption({
                label: option.label || option.value,
                value: option.value,
              })
          )
        ),
        defaultValue: data.options?.[0].value,
      });

      await instance.create([...widgets, formField]);
      break;
    }

    case FORM_TYPES.LISTBOX: {
      const [width, height] = [150, 30];

      const widget = new PSPDFKit.Annotations.WidgetAnnotation({
        ...widgetProperties,
        id: PSPDFKit.generateInstantId(),
        boundingBox: new PSPDFKit.Geometry.Rect({
          left: Math.max(x - width / 2, 0),
          top: Math.max(0, y - height / 2),
          width,
          height,
        }),
      });
      const formField = new PSPDFKit.FormFields.ListBoxFormField({
        name: formFieldName,
        annotationIds: new PSPDFKit.Immutable.List([widget.id]),
        values: PSPDFKit.Immutable.List([]),
        options: new PSPDFKit.Immutable.List(
            data.options?.map(
                (option) =>
                    new PSPDFKit.FormOption({
                      label: option.label || option.value,
                      value: option.value,
                    })
            )
        ),
      });

      await instance.create([widget, formField]);
      break;
    }

    case FORM_TYPES.COMBOBOX: {
      const [width, height] = [150, 30];

      const widget = new PSPDFKit.Annotations.WidgetAnnotation({
        ...widgetProperties,
        id: PSPDFKit.generateInstantId(),
        boundingBox: new PSPDFKit.Geometry.Rect({
          left: Math.max(x - width / 2, 0),
          top: Math.max(0, y - height / 2),
          width,
          height,
        }),
      });
      const formField = new PSPDFKit.FormFields.ComboBoxFormField({
        name: formFieldName,
        annotationIds: new PSPDFKit.Immutable.List([widget.id]),
        values: PSPDFKit.Immutable.List([]),
        options: new PSPDFKit.Immutable.List(
            data.options?.map(
                (option) =>
                    new PSPDFKit.FormOption({
                      label: option.label || option.value,
                      value: option.value,
                    })
            )
        ),
      });
      await instance.create([widget, formField]);
      break;
    }

    case FORM_TYPES.BUTTON: {
      const [width, height] = [200, 30];

      const widget = new PSPDFKit.Annotations.WidgetAnnotation({
        ...widgetProperties,
        fontColor: PSPDFKit.Color.WHITE,
        backgroundColor: PSPDFKit.Color.BLUE,
        boundingBox: new PSPDFKit.Geometry.Rect({
          left: Math.max(x - width / 2, 0),
          top: Math.max(0, y - height / 2),
          width,
          height,
        }),
      });

      const formField = new PSPDFKit.FormFields.ButtonFormField({
        name: formFieldName,
        label: data?.label || label,
        annotationIds: new PSPDFKit.Immutable.List([widget.id]),
      });

      await instance.create([widget, formField]);
      break;
    }

    default:
      throw new Error(`Can't insert unknown annotation! (${currentFormField})`);
  }
}
