import React from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Textarea,
  InputProps,
} from '@chakra-ui/core';
import { useField } from 'formik';

interface InputFieldProps extends InputProps {
  label: string;
  name: string;
  inputVariant?: 'input' | 'textarea';
}

const InputVariants = {
  input: Input,
  textarea: Textarea,
};

const InputField: React.FC<InputFieldProps> = ({
  label,
  size: _,
  inputVariant = 'input',
  ...props
}) => {
  const InputComponent = InputVariants[inputVariant];

  const [field, { error }] = useField(props);

  return (
    <FormControl isInvalid={!!error}>
      <FormLabel htmlFor={field.name}>{label}</FormLabel>
      <InputComponent {...field} {...props} id={field.name} />
      {error && <FormErrorMessage>{error}</FormErrorMessage>}
    </FormControl>
  );
};

export default InputField;
