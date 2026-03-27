import { Text, TextInput } from 'react-native';

let applied = false;

export function applyMontserratDefaults() {
  if (applied) {
    return;
  }

  applied = true;

  const TextComponent = Text as any;
  const TextInputComponent = TextInput as any;

  TextComponent.defaultProps = {
    ...(TextComponent.defaultProps ?? {}),
    style: [{ fontFamily: 'Montserrat_400Regular' }, TextComponent.defaultProps?.style],
  };

  TextInputComponent.defaultProps = {
    ...(TextInputComponent.defaultProps ?? {}),
    style: [{ fontFamily: 'Montserrat_400Regular' }, TextInputComponent.defaultProps?.style],
  };
}
