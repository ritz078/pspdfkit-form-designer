import { useDrag } from "react-dnd";
import ItemTypes from "../constants/itemTypes";
import Icon from "@mdi/react";
import classNames from "classnames";

export default function FormElement({ item, onClick }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.FORM_ELEMENT,
    item,
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult();
      if (item && dropResult) {
        console.log(`You dropped ${item.name} into ${dropResult.name}!`);
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div ref={drag} onClick={onClick}>
      <div
        className={classNames(
          "text-gray-600 hover:bg-gray-50 hover:text-gray-900 group flex items-center px-3 py-2 text-sm font-medium rounded-md cursor-pointer",
          {
            "cursor-move": isDragging,
          }
        )}
      >
        <Icon
          className="text-gray-700 group-hover:text-gray-500 flex-shrink-0 -ml-1 mr-3 h-6 w-6"
          aria-hidden="true"
          path={item.icon}
        />
        <span className="truncate">{item.label}</span>
      </div>
    </div>
  );
}
