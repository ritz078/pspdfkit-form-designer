import React, { useEffect, useRef, Fragment, useState } from "react";
import 'tailwindcss/tailwind.css';
import { Dialog, Transition } from '@headlessui/react'

// Our form field buttons in the sidebar
const navigation = [
  { name: 'Text', href: '#', icon: '/form_text.svg', current: true },
  { name: 'Signature', href: '#', icon: "/form_signature.svg", current: false },
  { name: 'Date', href: '#', icon: "/form_date.svg", current: false },
  { name: 'Radio', href: '#', icon: "/form_radio.svg", current: false },
]

var PSPDFKit;
var newInstance;

// Button used to exit form designer mode.
const exitFormDesignModeButton = {
	type: "custom",
	id: "my-button",
	title: "Exit Form Design Mode",
	onPress: (event) => {
		newInstance.setViewState(viewState => (
      viewState.set("formDesignMode", false)
    ));
	},
};

export default function App() {
  const containerRef = useRef(null);
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    const container = containerRef.current;

    (async function () {
      PSPDFKit = await import("pspdfkit");
      await PSPDFKit.load({
        container,
        document: "/example.pdf",
        baseUrl: `${window.location.protocol}//${window.location.host}/`,
        initialViewState: new PSPDFKit.ViewState({ readOnly: false, formDesignMode: true })
      }).then((instance) => {
        newInstance = instance;
        const items = instance.toolbarItems;
        // Hide everything in the toolbar except for the export button and then add a button to exit the form design mode.
        instance.setToolbarItems(items.filter((item) => item.type == "export-pdf"));
        instance.setToolbarItems(items => {
          items.push(exitFormDesignModeButton);
          return items;
        });
      });
    })();

    return () => PSPDFKit && PSPDFKit.unload(container);
  },[]);

  return (
      
    <div className="h-screen flex overflow-hidden bg-white">
    <Transition.Root show={sidebarOpen} as={Fragment}>
      <Dialog as="div" className="fixed inset-0 flex z-40 md:hidden" onClose={setSidebarOpen}>
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
            >
            </Transition.Child>
          </div>
        </Transition.Child>
        <div className="flex-shrink-0 w-14">{/* Force sidebar to shrink to fit close icon */}</div>
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
              <span class="ml-2 truncate">PDF Designer</span>
            </div>
            <nav className="mt-5 flex-1 px-2 bg-white space-y-1">
              {/* Here we add the items to the sidebar */}
              {navigation.map((item) => (
                <a 
                name={item.name}
                href={item.href} 
                onClick={handleInsertableAnnoClick}
                class="w-fill flex p-3 bg-blue-50 hover:bg-gray-200 rounded-lg">
                  <img class="flex-none w-6 h-full" src={item.icon} />
                <span class="ml-2 truncate">{item.name}</span>
              </a>
              ))}
            </nav>
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
    </div>
  );
}

function createFormFieldName() {
  return `form-field-${Math.random()
    .toString(36)
    .slice(-5)}`;
}

function insertAnnotation(type) {
  // We need to reference this when creating both the widget annotation and the
  // form field itself, so that they are linked.
  const formFieldName = createFormFieldName();

  const widgetProperties = {
    id: PSPDFKit.generateInstantId(),
    pageIndex: newInstance.viewState.currentPageIndex,
    formFieldName
  };

  let left = 30;
  let top = 30;

  switch (type) {
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
          height: 15
        })
      });

      const formField = new PSPDFKit.FormFields.TextFormField({
        name: formFieldName,
        // Link to the annotation with the ID
        annotationIds: new PSPDFKit.Immutable.List([widget.id])
      });

      newInstance.create([widget, formField]);
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
          height: 30
        })
      });

      const formField = new PSPDFKit.FormFields.SignatureFormField({
        name: formFieldName,
        annotationIds: new PSPDFKit.Immutable.List([widget.id])
      });

      newInstance.create([widget, formField]);
      break;
    }

    case "Radio": {
      // Need a new var here as the field names need to match.
      const radioFormFieldName = formFieldName

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
          height: 30
        })
      });

      const widget2 = new PSPDFKit.Annotations.WidgetAnnotation({
        ...widgetProperties,
        id: PSPDFKit.generateInstantId(),
        formFieldName: radioFormFieldName,
        borderColor: PSPDFKit.Color.BLACK,
        borderWidth: 1,
        borderStyle: "solid",
        backgroundColor: PSPDFKit.Color.WHITE,
        boundingBox: new PSPDFKit.Geometry.Rect({
          left: left + 20,
          top,
          width: 30,
          height: 30
        })
      });

      const formField = new PSPDFKit.FormFields.RadioButtonFormField({
        name: radioFormFieldName,
        annotationIds: new PSPDFKit.Immutable.List([widget.id, widget2.id]),
        options: new PSPDFKit.Immutable.List([
          new PSPDFKit.FormOption({
            label: 'Option 1',
            value: '1',
          }),
          new PSPDFKit.FormOption({
            label: 'Option 2',
            value: '2',
          }),
        ]),
        defaultValue: '1'
      });
      
      newInstance.create([widget, widget2, formField]);
      break;
    }

    default:
      throw new Error(`Can't insert unknown annotation! (${type})`);
  }
}

function handleInsertableAnnoClick(event) {
  // Use the name of the target to decide for the annotation type.
  const type = event.currentTarget.name;

  insertAnnotation(type);
}
