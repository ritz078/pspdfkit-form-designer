import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import Icon from "@mdi/react";
import { mdiClose, mdiPlus } from "@mdi/js";
import { Formik } from "formik";
import classNames from "classnames";
import createWidgetAnnotation from "../utils/createWidgetAnnotation";

export default function onCreateWidget({
  show,
  selectedFormType,
  onClose,
  PSPDFKit,
  instance,
  point,
}) {
  return (
    <Transition appear show={show} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-10 overflow-y-auto"
        onClose={onClose}
      >
        <div className="min-h-screen px-4 text-center">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-black opacity-60" />
          </Transition.Child>

          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded">
              <Formik
                initialValues={{
                  name: "",
                  label: "",
                  options: [],
                  _name: "",
                  _label: "",
                }}
                enableReinitialize
                onSubmit={async (values, actions) => {
                  await createWidgetAnnotation(
                    instance,
                    selectedFormType,
                    PSPDFKit,
                    values,
                    point
                  );

                  onClose();
                }}
              >
                {(props) => {
                  return (
                    <>
                      <Dialog.Title>
                        <div className="text-gray-600 mb-5 flex flex-row items-center">
                          {selectedFormType?.label}
                        </div>
                      </Dialog.Title>

                      <div className="isolate -space-y-px rounded-md shadow-sm">
                        <div className="relative border border-gray-300 rounded-md rounded-b-none px-3 py-2 focus-within:z-10 focus-within:ring-1 focus-within:ring-indigo-600 focus-within:border-indigo-600">
                          <label
                            htmlFor="name"
                            className="block text-xs font-medium text-gray-700"
                          >
                            Name <span className="text-red-600">*</span>
                          </label>
                          <input
                            type="text"
                            name="name"
                            id="name"
                            value={props.values.name}
                            onChange={props.handleChange}
                            className="block border-0 p-0 text-gray-900 placeholder-gray-500 focus:ring-0 sm:text-sm"
                            placeholder="Enter Form Field Name"
                          />
                        </div>
                        {selectedFormType.config.label && (
                          <div className="relative border border-gray-300 rounded-md rounded-t-none px-3 py-2 focus-within:z-10 focus-within:ring-1 focus-within:ring-indigo-600 focus-within:border-indigo-600">
                            <label
                              htmlFor="label"
                              className="block w-full text-xs font-medium text-gray-700"
                            >
                              Label
                            </label>
                            <input
                              type="text"
                              name="label"
                              id="label"
                              value={props.values.label}
                              onChange={props.handleChange}
                              className="block w-full border-0 p-0 text-gray-900 placeholder-gray-500 focus:ring-0 sm:text-sm"
                              placeholder={selectedFormType?.label}
                            />
                          </div>
                        )}
                      </div>

                      <p
                        className="mt-2 text-sm text-gray-500"
                        id="email-description"
                      >
                        The form field name should be unique and should not
                        match the name of any other form field in this PDF.
                      </p>

                      {selectedFormType.config.options && (
                        <>
                          <div className="relative mt-4">
                            <div
                              className="absolute inset-0 flex items-center"
                              aria-hidden="true"
                            >
                              <div className="w-full border-t border-gray-300" />
                            </div>
                            <div className="relative flex justify-start">
                              <span className="pr-3 bg-white text-lg font-medium text-gray-900">
                                Options
                              </span>
                            </div>
                          </div>
                          {props.values.options.map((option) => (
                            <div
                              className="flex flex-row gap-2 mt-2"
                              key={option.name}
                            >
                              <div className="pointer-events-none opacity-40">
                                <label htmlFor="name" className="sr-only">
                                  Option Name
                                </label>
                                <input
                                  disabled
                                  type="text"
                                  name="name"
                                  id="name"
                                  value={option.name}
                                  className="shadow-sm block w-full sm:text-sm border-gray-300 rounded-md"
                                  placeholder="Option Name"
                                />
                              </div>

                              <div className="pointer-events-none opacity-40">
                                <label htmlFor="label" className="sr-only">
                                  Option Label
                                </label>
                                <input
                                  disabled
                                  type="text"
                                  name="label"
                                  id="label"
                                  value={option.label}
                                  className="shadow-sm block w-full sm:text-sm border-gray-300 rounded-md"
                                  placeholder="Option Label"
                                />
                              </div>

                              <button
                                type="button"
                                className="inline-flex items-center p-2 border border-transparent rounded-full shadow-sm text-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                              >
                                <Icon
                                  path={mdiClose}
                                  className="h-5 w-5"
                                  aria-hidden="true"
                                />
                              </button>
                            </div>
                          ))}
                          <div className="flex flex-row gap-2 mt-2">
                            <div>
                              <label htmlFor="option-name" className="sr-only">
                                Option Name
                              </label>
                              <input
                                type="text"
                                name="_name"
                                id="option-name"
                                value={props.values._name}
                                onChange={props.handleChange}
                                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                placeholder="Option Name"
                              />
                            </div>

                            <div>
                              <label htmlFor="option-label" className="sr-only">
                                Option Label
                              </label>
                              <input
                                type="text"
                                name="_label"
                                id="option-label"
                                value={props.values._label}
                                onChange={props.handleChange}
                                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                placeholder="Option Label"
                              />
                            </div>

                            <button
                              disabled={!props.values._name}
                              type="button"
                              className={classNames(
                                "inline-flex items-center p-2 border border-transparent rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                              )}
                              onClick={() => {
                                props.setFieldValue("options", [
                                  ...props.values.options,
                                  {
                                    name: props.values._name,
                                    label: props.values._label,
                                  },
                                ]);

                                props.setFieldValue("_name", "");
                                props.setFieldValue("_label", "");
                              }}
                            >
                              <Icon
                                path={mdiPlus}
                                className="h-5 w-5"
                                aria-hidden="true"
                              />
                            </button>
                          </div>
                        </>
                      )}

                      <div className="flex mt-2 justify-end">
                        <button
                          onClick={onClose}
                          type="button"
                          className="mt-6 mr-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gray-500 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={props.handleSubmit}
                          type="button"
                          disabled={!props.values.name}
                          className={classNames(
                            "mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600",
                            {
                              "opacity-60 cursor-not-allowed":
                                !props.values.name,
                              "hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500":
                                props.values.name,
                            }
                          )}
                        >
                          Add {selectedFormType?.label} Widget
                        </button>
                      </div>
                    </>
                  );
                }}
              </Formik>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}
