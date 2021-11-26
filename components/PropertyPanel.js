import { useEffect, useState } from "react";
import { Formik } from "formik";
import ColorPicker from "./ColorPicker";
import Icon from "@mdi/react";
import { mdiSelectionEllipseArrowInside } from "@mdi/js";

const fieldClass =
  "flex-1 focus:ring-indigo-100 text-blue-600 focus:border-indigo-500 p-0 px-1 block w-full min-w-0 rounded-md sm:text-sm border-0 border-b border-dashed rounded-none! w-full";

export default function PropertyPanel({ instance, pspdfkit }) {
  const [initialValues, setInitialValues] = useState();
  const [selectedAnnotation, setSelectedAnnotation] = useState(null);

  useEffect(() => {
    if (!instance) return;

    instance.addEventListener(
      "annotationSelection.change",
      setSelectedAnnotation
    );

    return () => {
      instance.removeEventListener(
        "annotationSelection.change",
        setSelectedAnnotation
      );
    };
  }, [instance]);

  useEffect(() => {
    if (!selectedAnnotation) {
      setInitialValues(null);
      return;
    }

    setInitialValues(
      pspdfkit.Annotations.toSerializableObject(selectedAnnotation)
    );
  }, [selectedAnnotation]);

  return (
    <div
      className="p-4 border-l border-gray-200 overflow-auto"
      style={{
        width: 360,
      }}
    >
      <style global jsx>
        {`
          select {
            width: 150px !important;
          }

          hr {
            margin: 15px 0;
            width: 10%;
            background-color: green;
          }

          input[type="checkbox"] {
            margin: 4px 0;
          }
        `}
      </style>
      {selectedAnnotation && initialValues ? (
        <Formik
          initialValues={initialValues}
          onSubmit={async (values, actions) => {
            const annotation =
              pspdfkit.Annotations.fromSerializableObject(values);

            instance.update(annotation.set("id", values.id));
          }}
          enableReinitialize
        >
          {(props) => (
            <form onSubmit={props.handleSubmit}>
              <div className="sm:col-span-4">
                <div className="text-sm text-gray-600 my-2 opacity-80">
                  <Field title={"ID"}>{props.values.id}</Field>
                  <Field title={"FormField Name"}>
                    {props.values.formFieldName}
                  </Field>
                  <Field title={"Created at"}>
                    {new Date(props.values.createdAt).toLocaleDateString()}
                  </Field>
                  <Field title={"Updated at"}>
                    {new Date(props.values.updatedAt).toLocaleDateString()}
                  </Field>
                </div>
                <hr />

                <Field hor title={"Background Color"} name="backgroundColor">
                  <ColorPicker
                    value={props.values.backgroundColor}
                    onChange={(color) => {
                      props.setFieldValue("backgroundColor", color);
                      props.submitForm();
                    }}
                  />
                </Field>

                <hr />
                <Field hor title={"Border Color"} name="borderColor">
                  <ColorPicker
                    value={props.values.borderColor}
                    onChange={(color) => {
                      props.setFieldValue("borderColor", color);
                      props.submitForm();
                    }}
                  />
                </Field>
                <Field hor title={"Border Style"} name="borderStyle">
                  <select
                    name="borderStyle"
                    id="borderStyle"
                    className={fieldClass}
                    style={{
                      borderRadius: 0,
                    }}
                    value={props.values.borderStyle}
                    onChange={(e) => {
                      props.setFieldValue("borderStyle", e.target.value);
                      props.submitForm();
                    }}
                  >
                    {Object.keys(pspdfkit.BorderStyle).map((borderStyle) => (
                      <option
                        key={borderStyle}
                        value={pspdfkit.BorderStyle[borderStyle]}
                      >
                        {borderStyle}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field
                  hor
                  title={"Border Width"}
                  name="borderWidth"
                  type="number"
                  value={props.values.borderWidth}
                  onChange={(e) => {
                    props.setFieldValue(
                      "borderWidth",
                      parseInt(e.target.value, 10)
                    );
                    props.submitForm();
                  }}
                />

                <hr />

                <Field
                  hor
                  title={"Font Size"}
                  name="fontSize"
                  type="number"
                  value={props.values.fontSize}
                  onChange={(e) => {
                    props.setFieldValue(
                      "fontSize",
                      parseInt(e.target.value, 10)
                    );
                    props.submitForm();
                  }}
                />

                <Field title={"Font Color"} name="fontColor">
                  <ColorPicker
                    value={props.values.fontColor}
                    onChange={(color) => {
                      props.setFieldValue("fontColor", color);
                      props.submitForm();
                    }}
                  />
                </Field>

                <Field
                  hor
                  title={"Font"}
                  name="font"
                  value={props.values.font}
                  onChange={(e) => {
                    props.setFieldValue("font", e.target.value);
                    props.submitForm();
                  }}
                />
                <Field
                  hor
                  title={"Bold"}
                  name="isBold"
                  type="checkbox"
                  value={props.values.isBold}
                  onChange={(e) => {
                    props.setFieldValue("isBold", e.target.value);
                    props.submitForm();
                  }}
                />
                <Field
                  hor
                  title={"Italic"}
                  name="isItalic"
                  type="checkbox"
                  value={props.values.isItalic}
                  onChange={(e) => {
                    props.setFieldValue("isItalic", e.target.value);
                    props.submitForm();
                  }}
                />

                <hr />
                <Field hor title={"Horizontal Align"} name="horizontalAlign">
                  <select
                    name="horizontalAlign"
                    id="horizontalAlign"
                    value={props.values.horizontalAlign}
                    onChange={(e) => {
                      props.setFieldValue("horizontalAlign", e.target.value);
                      props.submitForm();
                    }}
                    className={fieldClass}
                    style={{
                      borderRadius: 0,
                    }}
                  >
                    <option value="left">left</option>
                    <option value="right">right</option>
                    <option value="center">center</option>
                  </select>
                </Field>

                <Field hor title={"Vertical Align"} name="verticalAlign">
                  <select
                    name="verticalAlign"
                    id="verticalAlign"
                    value={props.values.verticalAlign}
                    onChange={(e) => {
                      props.setFieldValue("verticalAlign", e.target.value);
                      props.submitForm();
                    }}
                    style={{
                      borderRadius: 0,
                    }}
                    className={fieldClass}
                  >
                    <option value="top">top</option>
                    <option value="center">center</option>
                    <option value="bottom">bottom</option>
                  </select>
                </Field>

                <hr />
                <Field
                  hor
                  title={"Creator Name"}
                  type="text"
                  name="creatorName"
                  value={props.values.creatorName}
                  onChange={(e) => {
                    props.setFieldValue("creatorName", e.target.value);
                    props.submitForm();
                  }}
                />
                <Field
                  hor
                  title={"Print"}
                  name="noPrint"
                  type="checkbox"
                  value={!props.values.noPrint}
                  onChange={(e) => {
                    props.setFieldValue("noPrint", e.target.value);
                    props.submitForm();
                  }}
                />
                <Field
                  hor
                  title={"Opacity"}
                  name="noPrint"
                  type="number"
                  value={props.values.opacity}
                  onChange={(e) => {
                    props.setFieldValue(
                      "opacity",
                      parseInt(e.target.value, 10)
                    );
                    props.submitForm();
                  }}
                  props={{
                    min: 0,
                    max: 1,
                    step: 0.1,
                  }}
                />

                <hr />
                <Field title={"Note"} name="note">
                  <textarea
                    name="note"
                    id="note"
                    value={props.values.note}
                    onChange={(e) => {
                      props.setFieldValue("note", e.target.value);
                      props.submitForm();
                    }}
                    style={{
                      borderRadius: 0,
                    }}
                    className={fieldClass}
                  />
                </Field>
                <Field title={"Custom Data"} name="customData">
                  <textarea
                    name="customData"
                    id="customData"
                    value={props.values.customData}
                    onChange={(e) => {
                      props.setFieldValue("customData", e.target.value);
                      props.submitForm();
                    }}
                    style={{
                      borderRadius: 0,
                    }}
                    className={fieldClass}
                  />
                </Field>

                <hr />
              </div>
            </form>
          )}
        </Formik>
      ) : (
        <div className="relative flex flex-col items-center block w-full p-12 text-center text-gray-600">
          <Icon path={mdiSelectionEllipseArrowInside} className="w-16 h-16" />
          <span className="mt-2 block text-sm font-medium">
            Select a widget annotation to change it's properties.
          </span>
        </div>
      )}
    </div>
  );
}

function Field({
  title,
  name,
  type = "text",
  children,
  value,
  onChange,
  props,
}) {
  return (
    <div className={"flex flex-row items-center justify-between gap-10 my-1"}>
      <label htmlFor={name} className="block text-sm font-medium text-gray-600">
        {title}
      </label>
      <div className="mt-1 flex rounded-md">
        {children ? (
          <span className="text-sm">{children}</span>
        ) : (
          <div
            style={{
              width: 150,
            }}
          >
            <input
              type={type}
              name={name}
              id={name}
              style={{
                minWidth: type === "checkbox" ? 15 : 100,
                borderRadius: type === "checkbox" ? 999 : 0,
              }}
              defaultValue={value}
              onChange={onChange}
              className={
                type === "checkbox"
                  ? "focus:ring-indigo-500 w-4 text-indigo-600 border-gray-300 rounded"
                  : "flex-1 focus:ring-indigo-100 text-blue-600 focus:border-indigo-500 p-0 px-1 block w-full min-w-0 rounded-md sm:text-sm border-0 border-b border-dashed rounded-none!"
              }
              {...props}
            />
          </div>
        )}
      </div>
    </div>
  );
}
