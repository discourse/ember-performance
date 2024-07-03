import { helper as buildHelper } from "@ember/component/helper";

const currentLocale = Intl.NumberFormat().resolvedOptions().locale;

export function formatNumber(params, hash) {
  const { mode } = hash ?? { mode: "auto" };

  let number = params;

  if (mode !== "auto") {
    return Intl.NumberFormat(currentLocale, hash).format(number);
  }

  const [, exponent] = Number(number)
    .toExponential()
    .split("e")
    .map((item) => Number(item));

  if (exponent >= 0) {
    return Intl.NumberFormat(currentLocale, {
      minimumFractionDigits: 3,
    }).format(number);
  }

  return Intl.NumberFormat(currentLocale, {
    minimumFractionDigits: Math.abs(exponent) + 2,
  }).format(number);
}

export default buildHelper(formatNumber);
