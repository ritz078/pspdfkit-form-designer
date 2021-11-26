import { useEffect, useState } from "react";

export default function FormFields({ instance, PSPDFKit }) {
  const [widgets, setWidgets] = useState([]);

  useEffect(() => {
    if (!instance) return;
    (async function () {
      const annotations = await instance.getAnnotations(
        instance.viewState.currentPageIndex
      );
      setWidgets(
        annotations.filter(
          (ann) => ann instanceof PSPDFKit.Annotations.WidgetAnnotation
        )
      );
    })();
  }, [instance]);

  console.log(widgets);

  return <div></div>;
}
