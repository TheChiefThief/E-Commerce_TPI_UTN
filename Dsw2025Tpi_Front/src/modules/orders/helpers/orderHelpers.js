export const getVal = (o, ...names) => {
  for (const n of names) {
    if (o == null) return undefined;
    if (Object.prototype.hasOwnProperty.call(o, n) && o[n] !== undefined && o[n] !== null) return o[n];
    const lower = n.charAt(0).toLowerCase() + n.slice(1);
    if (o[lower] !== undefined && o[lower] !== null) return o[lower];
    const upper = n.charAt(0).toUpperCase() + n.slice(1);
    if (o[upper] !== undefined && o[upper] !== null) return o[upper];
  }
  return undefined;
};

export const formatDateVal = (val) => {
  try {
    if (!val) return '-';
    const d = typeof val === 'number' ? new Date(val) : new Date(String(val));
    if (isNaN(d.getTime())) return String(val);
    return d.toLocaleString();
  } catch (e) {
    return String(val);
  }
};

export const isGuidLike = (val) => {
  if (!val) return false;
  const s = String(val).trim();
  const guidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
  if (guidRegex.test(s)) return true;
  if (/^[0-9]{10,}$/.test(s)) return true;
  return false;
};

export const findInAttributes = (arr, key) => {
  if (!Array.isArray(arr)) return undefined;
  const k = String(key || '').toLowerCase();
  const a = arr.find(x => {
    const label = (x?.key ?? x?.name ?? x?.label ?? '').toString().toLowerCase();
    return label === k;
  });
  return a?.value ?? a?.val ?? a?.v;
};

export const parseNumber = (v) => {
  if (v === undefined || v === null) return NaN;
  if (typeof v === 'number') return v;
  const cleaned = String(v).replace(/[^0-9.-]+/g, '');
  if (!cleaned) return NaN;
  return parseFloat(cleaned);
};
