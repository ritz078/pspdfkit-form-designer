import { useCallback, useEffect, useRef } from "react";
import ItemTypes from "../constants/itemTypes";
import { useDrop } from "react-dnd";

export default function Viewer({
  document,
  setInstance,
  PSPDFKit,
  instance,
  onDrop,
}) {
  const containerRef = useRef(null);

  const handleDrop = useCallback(
    (_, monitor) => {
      if (!instance) return;

      const point = instance.transformClientToPageSpace(
        new PSPDFKit.Geometry.Point(monitor.getClientOffset()),
        instance.viewState.currentPageIndex
      );

      onDrop(point, _);

      return { name: "viewer" };
    },
    [instance, PSPDFKit, onDrop]
  );

  const [{ canDrop, isOver }, drop] = useDrop(
    () => ({
      accept: ItemTypes.FORM_ELEMENT,
      drop: handleDrop,
      collect: (monitor) => {
        return {
          isOver: monitor.isOver(),
          canDrop: monitor.canDrop(),
        };
      },
    }),
    [handleDrop]
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!PSPDFKit) return;

    (async function () {
      PSPDFKit.load({
        container,
        document,
        baseUrl: `${window.location.protocol}//${window.location.host}/`,
        initialViewState: new PSPDFKit.ViewState({
          readOnly: false,
          formDesignMode: true,
        }),
      }).then((instance) => {
        window.instance = instance;
        window.PSPDFKit = PSPDFKit;
        const items = instance.toolbarItems;

        // Customize the toolbar to only include the needed buttons.
        instance.setToolbarItems([
          { type: "spacer" },
          ...items.filter(
            (item) =>
              item.type === "export-pdf" || item.type === "document-editor"
          ),
        ]);

        setInstance(instance);
      });
    })();
    return () => PSPDFKit && PSPDFKit.unload(container);
  }, [document, PSPDFKit]);

  return (
    <div ref={drop} role={"viewer"} style={{ height: "100vh" }}>
      <div
        ref={containerRef}
        style={{ height: "100vh", pointerEvents: canDrop ? "none" : undefined }}
      />
    </div>
  );
}
