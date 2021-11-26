import { Popover, Transition } from "@headlessui/react";
import { SketchPicker } from "react-color";

export default function ColorPicker({ value, onChange }) {
  return (
    <Popover className="relative">
      <Popover.Button>
        <div
          style={{
            backgroundColor: value,
            width: 60,
            height: 20,
            borderRadius: 2,
            border: "1px solid #aaa",
          }}
        />
      </Popover.Button>

      <Transition
        enter="transition duration-100 ease-out"
        enterFrom="transform scale-95 opacity-0"
        enterTo="transform scale-100 opacity-100"
        leave="transition duration-75 ease-out"
        leaveFrom="transform scale-100 opacity-100"
        leaveTo="transform scale-95 opacity-0"
      >
        <Popover.Panel className="absolute z-10 right-0">
          <SketchPicker
            color={value}
            onChange={(color) => onChange(color.hex)}
          />
        </Popover.Panel>
      </Transition>
    </Popover>
  );
}
