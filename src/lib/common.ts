export const any = <T>(arr: T[], pred?: (elem: T, idx?: number, arr?: T[]) => boolean) => {
  for (let i = 0; i < arr.length; i++) if (pred ? pred(arr[i], i, arr) : arr[i]) return true;
  return false;
};

export const all = <T>(xs: T[], pred?: (t: T, idx?: number, arr?: T[]) => boolean) =>
  !(pred ? any(xs, (t, i, a) => !pred(t, i, a)) : any(xs, (t) => !t));
