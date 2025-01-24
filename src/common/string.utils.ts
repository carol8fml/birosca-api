/**
 * Normaliza uma string removendo espaços em branco e convertendo para minúsculas.
 *
 * @param value A string a ser normalizada.
 * @returns A string normalizada.
 */
export const normalizeString = (value: string): string => {
  return value.trim().toLowerCase();
};
