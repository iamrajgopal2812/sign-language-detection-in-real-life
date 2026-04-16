// ═══════════════════════════ HAND CLASSIFIER ═══════════════════════════

function classifyHand(lm) {
  function dist(a, b) {
    return Math.hypot(lm[a].x - lm[b].x, lm[a].y - lm[b].y);
  }

  const tip = [4, 8, 12, 16, 20];
  const pip = [3, 6, 10, 14, 18];
  const mcp = [2, 5, 9, 13, 17];
  const hs = dist(0, 9);

  function ext(f) {
    if (f === 0) return Math.abs(lm[4].x - lm[0].x) > Math.abs(lm[3].x - lm[0].x);
    return lm[tip[f]].y < lm[pip[f]].y;
  }
  function curl(f) {
    if (f === 0) return 0;
    const ty = lm[tip[f]].y, my = lm[mcp[f]].y, py = lm[pip[f]].y;
    return ty > my ? 1 : ty > py ? .5 : 0;
  }

  const e = [ext(0), ext(1), ext(2), ext(3), ext(4)];
  const c = [curl(0), curl(1), curl(2), curl(3), curl(4)];

  function close(d) { return d < hs * .18; }
  function med(d)   { return d < hs * .28; }

  const t4_8  = dist(4, 8);
  const t4_12 = dist(4, 12);
  const t4_16 = dist(4, 16);
  const t4_20 = dist(4, 20);
  const i8_12 = dist(8, 12);
  const m12_16 = dist(12, 16);
  const r16_20 = dist(16, 20);

  // ── ALPHABETS ──
  if (!e[1]&&!e[2]&&!e[3]&&!e[4]&&c[1]>.7&&c[2]>.7&&!close(t4_8))                             return {l:'A',c:82};
  if (!e[0]&&e[1]&&e[2]&&e[3]&&e[4])                                                            return {l:'B',c:85};
  if (!e[0]&&!e[1]&&!e[2]&&!e[3]&&!e[4]&&c[1]<.6&&med(t4_8))                                  return {l:'C',c:78};
  if (e[1]&&!e[2]&&!e[3]&&!e[4]&&close(t4_12))                                                 return {l:'D',c:80};
  if (!e[1]&&!e[2]&&!e[3]&&!e[4]&&c[1]>.8&&c[2]>.8&&c[3]>.8&&c[4]>.8)                         return {l:'E',c:79};
  if (e[2]&&e[3]&&e[4]&&!e[1]&&close(t4_8))                                                    return {l:'F',c:81};
  if (e[1]&&!e[2]&&!e[3]&&!e[4]&&Math.abs(lm[8].y-lm[5].y)<hs*.15&&!e[0])                    return {l:'G',c:77};
  if (e[1]&&e[2]&&!e[3]&&!e[4]&&close(i8_12)&&!e[0])                                          return {l:'H',c:79};
  if (!e[0]&&!e[1]&&!e[2]&&!e[3]&&e[4])                                                        return {l:'I',c:84};
  if (!e[1]&&!e[2]&&!e[3]&&e[4]&&e[0])                                                         return {l:'J',c:72};
  if (e[1]&&e[2]&&!e[3]&&!e[4]&&med(t4_8)&&med(t4_12)&&e[0])                                 return {l:'K',c:76};
  if (e[0]&&e[1]&&!e[2]&&!e[3]&&!e[4])                                                         return {l:'L',c:88};
  if (!e[1]&&!e[2]&&!e[3]&&!e[4]&&close(t4_8)&&c[1]>.6&&c[2]>.6&&c[3]>.5)                    return {l:'M',c:74};
  if (!e[1]&&!e[2]&&!e[3]&&!e[4]&&close(t4_12)&&c[1]>.5&&c[2]<.5)                             return {l:'N',c:73};
  if (med(t4_8)&&med(t4_12)&&!e[1]&&!e[2])                                                     return {l:'O',c:82};
  if (e[1]&&e[2]&&!e[3]&&!e[4]&&lm[8].y>lm[5].y&&med(t4_8))                                  return {l:'P',c:75};
  if (e[1]&&!e[2]&&!e[3]&&!e[4]&&lm[8].y>lm[5].y&&!e[0])                                     return {l:'Q',c:74};
  if (e[1]&&e[2]&&!e[3]&&!e[4]&&close(i8_12)&&lm[8].x<lm[12].x+hs*.05&&e[0])                return {l:'R',c:76};
  if (!e[1]&&!e[2]&&!e[3]&&!e[4]&&c[1]>.75&&!close(t4_8)&&!e[0])                             return {l:'S',c:80};
  if (!e[1]&&!e[2]&&!e[3]&&!e[4]&&close(t4_8)&&c[1]<.8)                                      return {l:'T',c:76};
  if (e[1]&&e[2]&&!e[3]&&!e[4]&&close(i8_12)&&!e[0])                                          return {l:'U',c:82};
  if (e[1]&&e[2]&&!e[3]&&!e[4]&&!close(i8_12)&&!e[0])                                         return {l:'V',c:85};
  if (e[1]&&e[2]&&e[3]&&!e[4]&&!e[0])                                                          return {l:'W',c:83};
  if (!e[0]&&c[1]>.3&&c[1]<.7&&!e[2]&&!e[3]&&!e[4])                                           return {l:'X',c:73};
  if (e[0]&&!e[1]&&!e[2]&&!e[3]&&e[4])                                                         return {l:'Y',c:86};
  if (e[1]&&!e[2]&&!e[3]&&!e[4]&&!e[0])                                                        return {l:'Z',c:71};

  // ── NUMBERS ──
  if (med(t4_8)&&med(t4_12)&&med(t4_16)&&!e[1]&&!e[2]&&!e[3]&&!e[4])                         return {l:'ZERO',c:80};
  if (e[1]&&!e[2]&&!e[3]&&!e[4]&&!e[0]&&lm[8].y<lm[6].y-hs*.2)                              return {l:'ONE',c:83};
  if (e[1]&&e[2]&&!e[3]&&!e[4]&&!close(i8_12)&&lm[4].x>lm[2].x)                             return {l:'TWO',c:80};
  if (e[0]&&e[1]&&e[2]&&!e[3]&&!e[4])                                                          return {l:'THREE',c:80};
  if (!e[0]&&e[1]&&e[2]&&e[3]&&e[4]&&lm[4].x<lm[8].x)                                        return {l:'FOUR',c:78};
  if (e[0]&&e[1]&&e[2]&&e[3]&&e[4])                                                            return {l:'FIVE',c:82};
  if (e[1]&&e[2]&&e[3]&&!e[4]&&e[0])                                                           return {l:'SIX',c:76};
  if (e[1]&&e[2]&&!e[3]&&e[4])                                                                 return {l:'SEVEN',c:77};
  if (e[1]&&!e[2]&&!e[3]&&e[4]&&!e[0])                                                         return {l:'EIGHT',c:79};
  if (!e[1]&&e[2]&&e[3]&&e[4]&&close(t4_8))                                                   return {l:'NINE',c:78};

  // ── WORDS ──
  if (e[0]&&e[1]&&e[2]&&e[3]&&e[4])                                                            return {l:'HELLO',c:80};
  if (e[0]&&!e[1]&&!e[2]&&!e[3]&&e[4])                                                         return {l:'I_LOVE_YOU',c:82};
  if (!e[0]&&e[1]&&e[2]&&e[3]&&e[4])                                                           return {l:'STOP',c:78};
  if (e[0]&&e[1]&&e[2]&&e[3]&&!e[4])                                                           return {l:'THANK_YOU',c:75};
  if (!e[0]&&e[1]&&e[2]&&e[3]&&e[4]&&!close(t4_8))                                            return {l:'PLEASE',c:76};

  return null;
}
