export const maskCPF = (v: string) => {
  v = v.replace(/\D/g, "").slice(0, 11);
  v = v.replace(/(\d{3})(\d)/, "$1.$2");
  v = v.replace(/(\d{3})(\d)/, "$1.$2");
  v = v.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  return v;
};

export const maskPhone = (v: string) => {
  v = v.replace(/\D/g, "").slice(0, 11);
  if (v.length > 10) {
    v = v.replace(/(\d{2})(\d{1})(\d{4})(\d{4})/, "($1) $2 $3-$4");
  } else {
    v = v.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
  }
  return v;
};

export const maskDate = (v: string) => {
  v = v.replace(/\D/g, "").slice(0, 8);
  v = v.replace(/(\d{2})(\d)/, "$1/$2");
  v = v.replace(/(\d{2})(\d)/, "$1/$2");
  return v;
};
