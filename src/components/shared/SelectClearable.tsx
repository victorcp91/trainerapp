import {
  CloseButton,
  Combobox,
  Input,
  InputBase,
  useCombobox,
} from "@mantine/core";

interface ISelectClearable {
  options: string[];
  value: string | null;
  setValue: (s: string | null) => void;
}

export function SelectClearable({
  options,
  value,
  setValue,
}: ISelectClearable) {
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });

  const renderedOptions = options.map((item) => (
    <Combobox.Option value={item} key={item}>
      {item}
    </Combobox.Option>
  ));

  return (
    <Combobox
      store={combobox}
      withinPortal={false}
      onOptionSubmit={(val) => {
        setValue(val);
        combobox.closeDropdown();
      }}
    >
      <Combobox.Target>
        <InputBase
          component="button"
          type="button"
          pointer
          rightSection={
            value !== null ? (
              <CloseButton
                size="sm"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => setValue(null)}
                aria-label="Todos"
              />
            ) : (
              <Combobox.Chevron />
            )
          }
          onClick={() => combobox.toggleDropdown()}
          rightSectionPointerEvents={value === null ? "none" : "all"}
        >
          {value || <Input.Placeholder size={2}>Todos</Input.Placeholder>}
        </InputBase>
      </Combobox.Target>

      <Combobox.Dropdown>
        <Combobox.Options>{renderedOptions}</Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
}
