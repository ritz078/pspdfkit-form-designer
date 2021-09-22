import { useEffect, useState } from "react";
import { useFormik, Formik } from "formik";

function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

export default function PropertyPanel({ instance, pspdfkit }) {
  const [initialValues, setInitialValues] = useState();
  const [selectedAnnotation, setSelectedAnnotation] = useState(null);

  useEffect(() => {
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
  }, []);

  useEffect(() => {
    if (!selectedAnnotation) {
      setInitialValues(null);
      return;
    }

    setInitialValues(
      pspdfkit.Annotations.toSerializableObject(selectedAnnotation)
    );
  }, [selectedAnnotation]);

  if (!initialValues) return null;

  return (
    <div className="p-4 border-l border-gray-200">
      <h1>My Form</h1>
      <Formik
        initialValues={initialValues}
        onSubmit={(values, actions) => {
          const annotation =
            pspdfkit.Annotations.fromSerializableObject(values);

          instance.update(annotation.set("id", values.id));
        }}
        enableReinitialize
      >
        {(props) => (
          <form onSubmit={props.handleSubmit}>
            <div className="sm:col-span-4">
              <Field
                hor
                title={"Border Color"}
                name="borderColor"
                type="color"
                value={props.values.borderColor}
                onChange={(e) => {
                  props.setFieldValue("borderColor", e.target.value);
                  props.submitForm();
                }}
              />
              <Field hor title={"Border Style"} name="borderStyle">
                <select
                  name="borderStyle"
                  id="borderStyle"
                  className="flex-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full min-w-0 rounded-md sm:text-sm border-gray-300"
                  value={props.values.borderStyle}
                  onChange={(e) => {
                    props.setFieldValue("borderStyle", e.target.value);
                    props.submitForm();
                  }}
                >
                  {Object.keys(pspdfkit.BorderStyle).map((borderStyle) => (
                    <option key={borderStyle} value={pspdfkit.BorderStyle[borderStyle]}>
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

              <Field
                hor
                title={"Background Color"}
                name="backgroundColor"
                type="color"
                value={props.values.backgroundColor}
                onChange={(e) => {
                  props.setFieldValue("backgroundColor", e.target.value);
                  props.submitForm();
                }}
              />

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
                title={"Creator Name"}
                name="creatorName"
                value={props.values.creatorName}
                onChange={(e) => {
                  props.setFieldValue("creatorName", e.target.value);
                  props.submitForm();
                }}
              />

              <Field title={"Custom Data"} name="customData">
                <textarea
                  name="customData"
                  id="customData"
                  value={props.values.customData}
                  onChange={(e) => {
                    props.setFieldValue("customData", e.target.value);
                    props.submitForm();
                  }}
                  className="flex-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full min-w-0 rounded-md sm:text-sm border-gray-300"
                />
              </Field>

              <Field hor title={"Horizontal Alight"} name="horizontalAlign">
                <select
                  name="borderStyle"
                  id="borderStyle"
                  value={props.values.borderStyle}
                  onChange={(e) => {
                    props.setFieldValue("borderStyle", e.target.value);
                    props.submitForm();
                  }}
                  className="flex-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full min-w-0 rounded-md sm:text-sm border-gray-300"
                >
                  <option value="left">left</option>
                  <option value="right">right</option>
                  <option value="center">center</option>
                </select>
              </Field>

              <Field hor title={"Verical Align"} name="verticalAlign">
                <select
                  name="verticalAlign"
                  id="verticalAlign"
                  value={props.values.verticalAlign}
                  onChange={(e) => {
                    props.setFieldValue("verticalAlign", e.target.value);
                    props.submitForm();
                  }}
                  className="flex-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full min-w-0 rounded-md sm:text-sm border-gray-300"
                >
                  <option value="top">top</option>
                  <option value="center">center</option>
                  <option value="bottom">bottom</option>
                </select>
              </Field>

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
              <Field title={"Note"} name="note">
                <textarea
                  name="note"
                  id="note"
                  value={props.values.note}
                  onChange={(e) => {
                      props.setFieldValue("note", e.target.value);
                      props.submitForm();
                  }}
                  className="flex-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full min-w-0 rounded-md sm:text-sm border-gray-300"
                />
              </Field>
            </div>
          </form>
        )}
      </Formik>
    </div>
  );
}

function Field({ title, name, type = "text", hor, children, value, onChange }) {
  return (
    <div
      className={
        hor
          ? "flex flex-row items-center justify-between gap-12"
          : "sm:col-span-4"
      }
    >
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {title}
      </label>
      <div className="mt-1 flex rounded-md shadow-sm">
        {children || (
          <input
            type={type}
            name={name}
            id={name}
            style={{
              minWidth: type !== "checkbox" ? 120 : 15,
            }}
            defaultValue={value}
            onChange={onChange}
            className="flex-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full min-w-0 rounded-md sm:text-sm border-gray-300"
          />
        )}
      </div>
    </div>
  );
}
