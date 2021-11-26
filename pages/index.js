// @ts-check

import React, { useEffect, useRef, useState } from "react";
import "tailwindcss/tailwind.css";
import FormElement from "../components/FormElement";

import PropertyPanel from "../components/PropertyPanel";
import formElements from "../constants/formElements";
import Viewer from "../components/Viewer";
import Icon from "@mdi/react";
import { mdiFileDocumentEdit, mdiFileUpload, mdiLightningBolt } from "@mdi/js";
import OnCreateWidget from "../components/OnCreateWidget";
import classNames from "classnames";
import { Switch } from "@headlessui/react";
import createWidgetAnnotation from "../utils/createWidgetAnnotation";

export default function App() {
  const fileInputRef = useRef(null);

  const [instance, setInstance] = useState(null);
  const [pdfDocument, setPdfDocument] = useState("/example.pdf");
  const [PSPDFKit, setPSPDFKit] = useState(null);
  const [clickedForm, setClickedInput] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [point, setPoint] = useState(null);
  const [justPlaying, setJustPlaying] = useState(false);
  const [formDesignEnabled, toggleFormDesignMode] = useState(true);

  useEffect(() => {
    (async function () {
      setPSPDFKit((await import("pspdfkit")).default);
    })();
  }, []);

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
    if (!instance) return;

    instance.setViewState((s) => s.set("formDesignMode", formDesignEnabled));
  }, [formDesignEnabled, instance]);

  return (
    <div className="h-screen flex overflow-hidden bg-white">
      {/* Static sidebar for desktop */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64">
          {/* Sidebar component, swap this element with another sidebar if you like */}
          <div className="flex-1 flex flex-col min-h-0 border-r border-gray-200 bg-white">
            <div className="flex-1 flex flex-col pt-5 overflow-y-auto">
              <div className="flex items-center flex-shrink-0 px-4">
                <img
                  className="h-8 w-auto"
                  src="/pspdfkit.svg"
                  alt="pspdfkit"
                />
                <span className="ml-2 truncate">PDF Form Designer</span>
              </div>

              <input
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={handleFileInputChange}
                ref={fileInputRef}
              />

              <div
                onClick={handleUploadClick}
                className={
                  "mt-5 text-gray-600 hover:bg-gray-50 hover:text-gray-900 group flex items-center px-3 py-2 text-sm font-medium rounded-md cursor-pointer border-b"
                }
              >
                <Icon
                  className="text-gray-700 group-hover:text-gray-500 flex-shrink-0 -ml-1 mr-3 h-6 w-6"
                  aria-hidden="true"
                  path={mdiFileUpload}
                />
                <span>Upload PDF</span>
              </div>

              <div className={!formDesignEnabled ? "opacity-40 pointer-events-none" : undefined}>
                {formElements.map((item) => (
                  <FormElement
                    key={item.type}
                    item={item}
                    onClick={() => {
                      if (justPlaying) {
                        createWidgetAnnotation(instance, item, PSPDFKit);
                      } else {
                        setShowModal(true);
                        setClickedInput(item);
                      }
                    }}
                  />
                ))}
              </div>

              <div
                className={
                  "text-gray-600 border-t hover:bg-gray-50 hover:text-gray-900 group flex px-3 py-2 text-sm font-medium rounded-md cursor-pointer flex items-center justify-between"
                }
              >
                <div className="flex flex-row">
                  <Icon
                    className="text-gray-700 group-hover:text-gray-500 flex-shrink-0 -ml-1 mr-3 h-6 w-6"
                    aria-hidden="true"
                    path={mdiFileDocumentEdit}
                  />
                  <span>Form Designer</span>
                </div>

                <span>
                  <Switch
                    checked={formDesignEnabled}
                    onChange={toggleFormDesignMode}
                    className="flex-shrink-0 group relative rounded-full inline-flex items-center justify-center h-5 w-10 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute bg-white w-full h-full rounded-md"
                    />
                    <span
                      aria-hidden="true"
                      className={classNames(
                        formDesignEnabled ? "bg-indigo-600" : "bg-gray-200",
                        "pointer-events-none absolute h-4 w-9 mx-auto rounded-full transition-colors ease-in-out duration-200"
                      )}
                    />
                    <span
                      aria-hidden="true"
                      className={classNames(
                        formDesignEnabled ? "translate-x-5" : "translate-x-0",
                        "pointer-events-none absolute left-0 inline-block h-5 w-5 border border-gray-200 rounded-full bg-white shadow transform ring-0 transition-transform ease-in-out duration-200"
                      )}
                    />
                  </Switch>
                </span>
              </div>
              <div
                className={
                  "text-gray-600 hover:bg-gray-50 hover:text-gray-900 group flex px-3 py-2 text-sm font-medium rounded-md cursor-pointer flex items-center justify-between"
                }
              >
                <div className="flex flex-row">
                  <Icon
                    className="text-gray-700 group-hover:text-gray-500 flex-shrink-0 -ml-1 mr-3 h-6 w-6"
                    aria-hidden="true"
                    path={mdiLightningBolt}
                  />
                  <span>Just Playing</span>
                </div>

                <span>
                  <Switch
                    checked={justPlaying}
                    onChange={setJustPlaying}
                    className="flex-shrink-0 group relative rounded-full inline-flex items-center justify-center h-5 w-10 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <span className="sr-only">Just Playing</span>
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute bg-white w-full h-full rounded-md"
                    />
                    <span
                      aria-hidden="true"
                      className={classNames(
                        justPlaying ? "bg-indigo-600" : "bg-gray-200",
                        "pointer-events-none absolute h-4 w-9 mx-auto rounded-full transition-colors ease-in-out duration-200"
                      )}
                    />
                    <span
                      aria-hidden="true"
                      className={classNames(
                        justPlaying ? "translate-x-5" : "translate-x-0",
                        "pointer-events-none absolute left-0 inline-block h-5 w-5 border border-gray-200 rounded-full bg-white shadow transform ring-0 transition-transform ease-in-out duration-200"
                      )}
                    />
                  </Switch>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <Viewer
          PSPDFKit={PSPDFKit}
          setInstance={setInstance}
          document={pdfDocument}
          instance={instance}
          onDrop={(point, _) => {
            if (justPlaying) {
              createWidgetAnnotation(instance, _, PSPDFKit, undefined, point);
            } else {
              setPoint(point);
              setShowModal(true);
              setClickedInput(_);
            }
          }}
        />
        <style global jsx>
          {`
            * {
              margin: 0;
              padding: 0;
            }
          `}
        </style>
      </div>
      <PropertyPanel instance={instance} pspdfkit={PSPDFKit} />
      <OnCreateWidget
        instance={instance}
        PSPDFKit={PSPDFKit}
        show={showModal}
        selectedFormType={clickedForm}
        onClose={() => {
          setShowModal(false);
          setPoint(false);
        }}
        point={point}
      />
    </div>
  );
}
