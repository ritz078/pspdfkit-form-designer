// @ts-check

import React, { useEffect, useRef, Fragment, useState } from "react";
import "tailwindcss/tailwind.css";
import { Dialog, Popover, Transition } from "@headlessui/react";
import { PlusSmIcon as PlusSmIconOutline } from "@heroicons/react/outline";

// Our form field buttons in the sidebar
const navigation = [
  { name: "Text", href: "#", icon: "/form_text.svg", current: true },
  { name: "Signature", href: "#", icon: "/form_signature.svg", current: false },
  { name: "Radio", href: "#", icon: "/form_radio.svg", current: false },
  { name: "Check Box", href: "#", icon: "/form-checkbox.svg", current: false },
  { name: "List Box", href: "#", icon: "/form-list.svg", current: false },
  { name: "Combo Box", href: "#", icon: "/form-combo.svg", current: false },
  { name: "Button", href: "#", icon: "/form-button.svg", current: false },
];

var PSPDFKit;
var newInstance;
var viewStateToggle = false;
var list;
var currentFormField;

import PropertyPanel from "../components/PropertyPanel";
import { usePopper } from "react-popper";

export default function App() {
  const containerRef = useRef(null);
  const fileInputRef = useRef(null);

  const [instance, setInstance] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [basicPopover, setBasicPopover] = useState(true);
  const [listPopover, setListPopover] = useState(false);
  const [addingPopover, setAddingPopover] = useState(false);
  const [pdfDocument, setPdfDocument] = useState("/example.pdf");

  // This function is used to determine which popover UI should be shown and which not.
  function setupPopover() {
    list = new PSPDFKit.Immutable.List([]);

    if (
      currentFormField == "Text" ||
      currentFormField == "Signature" ||
      currentFormField == "Button"
    ) {
      setBasicPopover(true);
      setListPopover(false);
      setAddingPopover(false);
    } else if (
      currentFormField == "Combo Box" ||
      currentFormField == "List Box"
    ) {
      setBasicPopover(true);
      setListPopover(true);
      setAddingPopover(false);
    } else if (currentFormField == "Radio" || currentFormField == "Check Box") {
      setBasicPopover(true);
      setListPopover(false);
      setAddingPopover(true);
    }
    console.log({ basicPopover, listPopover, addingPopover });
  }

  function handleUploadClick() {
    const fileInput = fileInputRef.current;
    if (fileInput instanceof HTMLInputElement) {
      fileInput.click();
    }
  }

  async function handleFileInputChange() {
    const fileInput = fileInputRef.current;
    if (fileInput instanceof HTMLInputElement) {
      const file = fileInput.files[0];
      if (file != null) {
        setPdfDocument(await file.arrayBuffer());
      }
    }
  }

  function handleUploadClick() {
    const fileInput = fileInputRef.current;
    if (fileInput instanceof HTMLInputElement) {
      fileInput.click();
    }
  }

  async function handleFileInputChange() {
    const fileInput = fileInputRef.current;
    if (fileInput instanceof HTMLInputElement) {
      const file = fileInput.files[0];
      if (file != null) {
        setPdfDocument(await file.arrayBuffer());
      }
    }
  }

  useEffect(() => {
    const container = containerRef.current;

    (async function () {
      PSPDFKit = (await import("pspdfkit")).default;
      PSPDFKit.load({
        container,
        document: pdfDocument,
        baseUrl: `${window.location.protocol}//${window.location.host}/`,
        initialViewState: new PSPDFKit.ViewState({
          readOnly: false,
          formDesignMode: true,
        }),
      }).then((instance) => {
        newInstance = instance;
        const items = instance.toolbarItems;

        // Customize the toolbar to only include the needed buttons.
        instance.setToolbarItems(
          items.filter(
            (item) =>
              item.type == "export-pdf" || item.type == "document-editor"
          )
        );

        // Button used to toggle form designer mode.
        const exitFormDesignModeButton = {
          /** @type {'custom'} */
          type: "custom",

          id: "my-button",
          title: "Toggle Form Design Mode",
          onPress: (event) => {
            instance.setViewState((viewState) =>
              viewState.set("formDesignMode", viewStateToggle)
            );

            if (viewStateToggle == true) {
              viewStateToggle = false;
            } else {
              viewStateToggle = true;
            }
          },
        };

        instance.setToolbarItems((items) => {
          items.push(exitFormDesignModeButton);
          return items;
        });

        setInstance(instance);
      });
    })();
    return () => PSPDFKit && PSPDFKit.unload(container);
  }, [pdfDocument]);

  return (
    <div className="h-screen flex overflow-hidden bg-white">
      <Transition.Root show={sidebarOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 flex z-40 md:hidden"
          onClose={setSidebarOpen}
        >
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-600 bg-opacity-75" />
          </Transition.Child>
          <Transition.Child
            as={Fragment}
            enter="transition ease-in-out duration-300 transform"
            enterFrom="-translate-x-full"
            enterTo="translate-x-0"
            leave="transition ease-in-out duration-300 transform"
            leaveFrom="translate-x-0"
            leaveTo="-translate-x-full"
          >
            <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
              <Transition.Child
                as={Fragment}
                enter="ease-in-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in-out duration-300"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              ></Transition.Child>
            </div>
          </Transition.Child>
          <div className="flex-shrink-0 w-14">
            {/* Force sidebar to shrink to fit close icon */}
          </div>
        </Dialog>
      </Transition.Root>

      {/* Static sidebar for desktop */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64">
          {/* Sidebar component, swap this element with another sidebar if you like */}
          <div className="flex-1 flex flex-col min-h-0 border-r border-gray-200 bg-white">
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
              <div className="flex items-center flex-shrink-0 px-4">
                <img
                  className="h-8 w-auto"
                  src="/pspdfkit.svg"
                  alt="pspdfkit"
                />
                <span className="ml-2 truncate">PDF Designer</span>
              </div>

              <input
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={handleFileInputChange}
                ref={fileInputRef}
              />

              <div className="px-2 pt-4">
                <button
                  className="w-full flex p-3 bg-blue-50 hover:bg-gray-200 rounded-lg"
                  onClick={handleUploadClick}
                >
                  <img className="flex-none w-6 h-full" src="/file.svg" />
                  <span className="ml-2 truncate">Upload PDF</span>
                </button>
              </div>

              <div className="pt-4">
                {/* Here we add the items to the sidebar */}
                {navigation.map((item) => (
                  <SidebarButton
                    key={item.name}
                    item={item}
                    setupPopover={setupPopover}
                    listPopover={listPopover}
                    addingPopover={addingPopover}
                    instance={instance}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <div ref={containerRef} style={{ height: "100vh" }} />
        <style global jsx>
          {`
            * {
              margin: 0;
              padding: 0;
            }
          `}
        </style>
      </div>
      {<PropertyPanel instance={instance} pspdfkit={PSPDFKit} />}
    </div>
  );
}

function SidebarButton({
  item,
  setupPopover,
  listPopover,
  addingPopover,
  instance,
}) {
  const [referenceElement, setReferenceElement] = useState();
  const [popperElement, setPopperElement] = useState();

  const { styles: popperStyles, attributes: popperAttrs } = usePopper(
    referenceElement,
    popperElement,
    {
      placement: "right",
    }
  );

  function handleSideButtonClick() {
    currentFormField = item.name;
    setupPopover();
  }

  return (
    <Popover className="w-fill px-2 py-1 bg-white space-y-1">
      {({ open }) => (
        <Fragment key={item.name}>
          <div onClick={handleSideButtonClick}>
            <Popover.Button
              key={item.name}
              name={item.name}
              href={item.href}
              className="w-full flex p-3 bg-blue-50 hover:bg-gray-200 rounded-lg"
              ref={setReferenceElement}
            >
              <img className="flex-none w-6 h-full" src={item.icon} />
              <span className="ml-2 truncate">{item.name}</span>
            </Popover.Button>
          </div>

          <Popover.Panel
            className="z-10 w-max max-w-sm px-4 ml-4 mt-3 sm:px-0 lg:max-w-3xl"
            style={popperStyles.popper}
            ref={setPopperElement}
            {...popperAttrs.popper}
          >
            {({ close }) => (
              <CreateFieldDialog
                listPopover={listPopover}
                addingPopover={addingPopover}
                close={close}
                instance={instance}
              />
            )}
          </Popover.Panel>

          {/* Ensure PSPDFKit container is covered by overlay to properly detet clicks outside popover */}
          <Popover.Overlay
            className={`${
              open ? "fixed inset-0 opacity-10" : "opacity-0"
            } bg-black`}
          />
        </Fragment>
      )}
    </Popover>
  );
}

function CreateFieldDialog({ listPopover, addingPopover, close, instance }) {
  const [fieldName, setFieldName] = useState("");

  function handleFieldNameChange(event) {
    setFieldName(event.currentTarget.value);
  }

  const canAddItem = fieldName.length > 0;
  const canAddAdditionalItem = fieldName.length > 0;
  const canSubmit = fieldName.length > 0;

  return (
    <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
      <div className="relative grid gap-8 bg-white p-7 lg:grid-cols-2">
        <a
          key="InputForm1"
          id="InputForm1"
          href="#"
          className="flex items-center p-2 -m-3 transition duration-150 ease-in-out rounded-lg hover:bg-gray-50 focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <div className="mt-1">
              <input
                type="text"
                name="form"
                id="form-name"
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                placeholder=""
                aria-describedby="form-name"
                value={fieldName}
                onChange={handleFieldNameChange}
              />
            </div>
            <p className="mt-2 text-sm text-gray-500" id="form-description">
              Enter the name of the form field.
            </p>
          </div>
        </a>

        <button
          type="button"
          disabled={!canSubmit}
          onClick={() => {
            close();
            insertAnnotation({
              instance,
            });
          }}
          className="inline-flex items-center px-6 py-3 border border-transparent shadow-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-25"
        >
          Add Form Field
        </button>

        {listPopover && (
          <>
            <a
              key="InputForm2"
              id="InputForm2"
              href="#"
              className="flex items-center p-2 -m-3 transition duration-150 ease-in-out rounded-lg hover:bg-gray-50 focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  New List Item
                </label>
                <div className="mt-1">
                  <input
                    type="item"
                    name="form"
                    id="list-item"
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    placeholder=""
                    aria-describedby="list-item"
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500" id="form-description">
                  Enter the name of an item for the list.
                </p>
              </div>
            </a>

            <button
              type="button"
              id="button2"
              disabled={!canAddItem}
              onClick={() => {
                const listItem = document.getElementById("list-item");
                if (listItem instanceof HTMLInputElement) {
                  var newItem = listItem.value;
                  list = list.push(
                    new PSPDFKit.FormOption({ label: newItem, value: newItem })
                  );
                } else {
                  throw "List was not an input element";
                }
              }}
              className="inline-flex items-center px-6 py-3 border border-transparent shadow-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-25"
            >
              Add Item to List
            </button>
          </>
        )}

        {addingPopover && (
          <button
            type="button"
            disabled={!canAddAdditionalItem}
            onClick={() => {
              insertAnnotation({ instance });
            }}
            className="inline-flex items-center p-3 border border-transparent rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-25"
          >
            <PlusSmIconOutline className="h-6 w-6" aria-hidden="true" />
            Add additional item
          </button>
        )}
      </div>
    </div>
  );
}

function insertAnnotation({ instance }) {
  // We need to reference this when creating both the widget annotation and the
  // form field itself, so that they are linked.
  const formNameInput = document.getElementById("form-name");
  if (!(formNameInput instanceof HTMLInputElement)) {
    throw "No form-name found";
  }

  const formFieldName = formNameInput.value;

  const widgetProperties = {
    id: PSPDFKit.generateInstantId(),
    pageIndex: instance.viewState.currentPageIndex,
    formFieldName,
  };

  let left = 30;
  let top = 30;

  console.log({ currentFormField });

  switch (currentFormField) {
    case "Text": {
      const widget = new PSPDFKit.Annotations.WidgetAnnotation({
        ...widgetProperties,
        borderColor: PSPDFKit.Color.BLACK,
        borderWidth: 1,
        borderStyle: "solid",
        backgroundColor: new PSPDFKit.Color({ r: 220, g: 240, b: 255 }),
        boundingBox: new PSPDFKit.Geometry.Rect({
          left,
          top,
          width: 225,
          height: 15,
        }),
      });

      const formField = new PSPDFKit.FormFields.TextFormField({
        name: formFieldName,
        // Link to the annotation with the ID
        annotationIds: new PSPDFKit.Immutable.List([widget.id]),
      });

      instance.create([widget, formField]);
      break;
    }

    case "Signature": {
      const widget = new PSPDFKit.Annotations.WidgetAnnotation({
        ...widgetProperties,
        borderColor: PSPDFKit.Color.BLACK,
        borderWidth: 1,
        borderStyle: "solid",
        backgroundColor: PSPDFKit.Color.WHITE,
        boundingBox: new PSPDFKit.Geometry.Rect({
          left,
          top,
          width: 225,
          height: 30,
        }),
      });

      const formField = new PSPDFKit.FormFields.SignatureFormField({
        name: formFieldName,
        annotationIds: new PSPDFKit.Immutable.List([widget.id]),
      });

      instance.create([widget, formField]);
      break;
    }

    case "Radio": {
      // Need a new var here as the field names need to match.
      const radioFormFieldName = formFieldName;

      const widget = new PSPDFKit.Annotations.WidgetAnnotation({
        ...widgetProperties,
        id: PSPDFKit.generateInstantId(),
        formFieldName: radioFormFieldName,
        borderColor: PSPDFKit.Color.BLACK,
        borderWidth: 1,
        borderStyle: "solid",
        backgroundColor: PSPDFKit.Color.WHITE,
        boundingBox: new PSPDFKit.Geometry.Rect({
          left,
          top,
          width: 30,
          height: 30,
        }),
      });

      const formField = new PSPDFKit.FormFields.RadioButtonFormField({
        name: radioFormFieldName,
        annotationIds: new PSPDFKit.Immutable.List([widget.id]),
        options: new PSPDFKit.Immutable.List([
          new PSPDFKit.FormOption({
            label: "Option 1",
            value: "1",
          }),
        ]),
        defaultValue: "1",
      });

      instance.create([widget, formField]);
      break;
    }

    case "Check Box": {
      // Need a new var here as the field names need to match.
      const radioFormFieldName = formFieldName;

      const widget = new PSPDFKit.Annotations.WidgetAnnotation({
        ...widgetProperties,
        id: PSPDFKit.generateInstantId(),
        formFieldName: radioFormFieldName,
        borderColor: PSPDFKit.Color.BLACK,
        borderWidth: 1,
        borderStyle: "solid",
        backgroundColor: PSPDFKit.Color.WHITE,
        boundingBox: new PSPDFKit.Geometry.Rect({
          left,
          top,
          width: 30,
          height: 30,
        }),
      });

      const formField = new PSPDFKit.FormFields.CheckBoxFormField({
        name: radioFormFieldName,
        annotationIds: new PSPDFKit.Immutable.List([widget.id]),
        options: new PSPDFKit.Immutable.List([
          new PSPDFKit.FormOption({
            label: "Option 1",
            value: "1",
          }),
        ]),
        defaultValue: "1",
      });

      instance.create([widget, formField]);
      break;
    }

    case "List Box": {
      const widget = new PSPDFKit.Annotations.WidgetAnnotation({
        ...widgetProperties,
        id: PSPDFKit.generateInstantId(),
        boundingBox: new PSPDFKit.Geometry.Rect({
          left,
          top,
          width: 150,
          height: 30,
        }),
      });
      const formField = new PSPDFKit.FormFields.ListBoxFormField({
        name: formFieldName,
        annotationIds: new PSPDFKit.Immutable.List([widget.id]),
        values: list[0],
        options: list,
      });

      instance.create([widget, formField]);
      break;
    }

    case "Combo Box": {
      const widget = new PSPDFKit.Annotations.WidgetAnnotation({
        ...widgetProperties,
        id: PSPDFKit.generateInstantId(),
        boundingBox: new PSPDFKit.Geometry.Rect({
          left,
          top,
          width: 150,
          height: 30,
        }),
      });
      const formField = new PSPDFKit.FormFields.ComboBoxFormField({
        name: formFieldName,
        annotationIds: new PSPDFKit.Immutable.List([widget.id]),
        values: list[0],
        options: list,
      });
      instance.create([widget, formField]);
      break;
    }

    case "Button": {
      const widget = new PSPDFKit.Annotations.WidgetAnnotation({
        ...widgetProperties,
        borderColor: PSPDFKit.Color.BLACK,
        borderWidth: 1,
        borderStyle: "solid",
        backgroundColor: PSPDFKit.Color.WHITE,
        boundingBox: new PSPDFKit.Geometry.Rect({
          left,
          top,
          width: 80,
          height: 50,
        }),
      });

      const formField = new PSPDFKit.FormFields.ButtonFormField({
        name: formFieldName,
        label: formFieldName,
        annotationIds: new PSPDFKit.Immutable.List([widget.id]),
      });
      instance.create([widget, formField]);
      break;
    }

    default:
      throw new Error(`Can't insert unknown annotation! (${currentFormField})`);
  }
}
