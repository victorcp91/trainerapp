import {
  CloseButton,
  Combobox,
  Input,
  InputBase,
  useCombobox,
} from "@mantine/core";
import { useTranslations } from "next-intl";

interface ISelectClearable {
  options: { value: string; label: string }[];
  value: string | null;
  setValue: (s: string | null) => void;
}

export function SelectClearable({
  options,
  value,
  setValue,
}: ISelectClearable) {
  const t = useTranslations();
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });

  // Adicionado para mapear o valor selecionado para sua label correspondente
  const selectedOption = options.find((opt) => opt.value === value);

  const renderedOptions = options.map((item) => (
    <Combobox.Option value={item.value} key={item.value}>
      {item.label}
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
                aria-label={t("common.all")}
              />
            ) : (
              <Combobox.Chevron />
            )
          }
          onClick={() => combobox.toggleDropdown()}
          rightSectionPointerEvents={value === null ? "none" : "all"}
        >
          {selectedOption ? (
            selectedOption.label
          ) : (
            <Input.Placeholder>{t("common.all")}</Input.Placeholder>
          )}
        </InputBase>
      </Combobox.Target>

      <Combobox.Dropdown>
        <Combobox.Options>{renderedOptions}</Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
}
