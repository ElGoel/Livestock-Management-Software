export const generateCodeFromName = (name: string): string => {
  const names = name.split(' ');
  let code = '';
  if (names.length > 1) {
    code += `${names[0][0].toUpperCase()}${names[1][0].toUpperCase()}`;
  } else {
    code += names[0].substring(0, 2).toUpperCase();
  }
  if (code.length < 2) {
    code += 'X';
  }

  return code;
};
