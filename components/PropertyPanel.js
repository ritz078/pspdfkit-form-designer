import { useEffect, useState } from "react";
import { Formik } from "formik";
import ColorPicker from "./ColorPicker";

export default function PropertyPanel({ instance, pspdfkit }) {
  const [initialValues, setInitialValues] = useState();
  const [selectedAnnotation, setSelectedAnnotation] = useState(null);

  useEffect(() => {
      if (!instance) return

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
    <div className="p-4 border-l border-gray-200 overflow-auto" style={{
        width: 360
    }}>
      <style global jsx>
        {`
          select {
            width: 100px !important;
          }

          hr {
            margin: 15px 0;
            width: 10%;
          }

          input[type="checkbox"] {
            margin: 4px 0;
          }
        `}
      </style>
      {selectedAnnotation && initialValues && (
        <>
          <h1 className="text-xl border-b">{initialValues.formFieldName}</h1>
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
                      className="flex-1 focus:ring-indigo-100 text-blue-600 focus:border-indigo-500 p-0 px-1 block w-full min-w-0 rounded-md sm:text-sm border-0 border-b border-dashed rounded-none!"
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
                      className="flex-1 focus:ring-indigo-100 text-blue-600 focus:border-indigo-500 p-0 px-1 block w-full min-w-0 rounded-md sm:text-sm border-0 border-b border-dashed rounded-none!"
                      style={{
                        borderRadius: 0,
                      }}
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
                      style={{
                        borderRadius: 0,
                      }}
                      className="flex-1 focus:ring-indigo-100 text-blue-600 focus:border-indigo-500 p-0 px-1 block w-full min-w-0 rounded-md sm:text-sm border-0 border-b border-dashed rounded-none!"
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
                      className="flex-1 focus:ring-indigo-100 text-blue-600 focus:border-indigo-500 p-0 px-1 block w-full min-w-0 rounded-md sm:text-sm border-0 border-b border-dashed rounded-none!"
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
                      className="flex-1 focus:ring-indigo-100 text-blue-600 focus:border-indigo-500 p-0 px-1 block w-full min-w-0 rounded-md sm:text-sm border-0 border-b border-dashed rounded-none!"
                    />
                  </Field>

                  <hr />

                  <Field title={"ID"}>{props.values.id}</Field>
                  <Field title={"Created at"}>
                    {new Date(props.values.createdAt).toLocaleDateString()}
                  </Field>
                  <Field title={"Updated at"}>
                    {new Date(props.values.updatedAt).toLocaleDateString()}
                  </Field>
                </div>
              </form>
            )}
          </Formik>
        </>
      )}
    </div>
  );
}

function Field({
  title,
  name,
  type = "text",
  hor,
  children,
  value,
  onChange,
  props,
}) {
  return (
    <div className={"flex flex-row items-center justify-between gap-12 my-3"}>
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
              minWidth: type === "checkbox" ? 15 : 100,
              maxWidth: 100,
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
        )}
      </div>
    </div>
  );
}
