export const rotation = (event, ctx) => {
  'worklet';
  let radian = Math.atan2(
    event.absoluteX - ctx.centers.x,
    event.absoluteY - ctx.centers.y
  );
  const rotationAngleInRad = -radian;
  return rotationAngleInRad;
};

/**
 * @private
 * @param {number} number The number to check.
 * @param {number} start The start of the range.
 * @param {number} end The end of the range.
 * @returns {boolean} Returns `true` if `number` is in the range, else `false`.
 */
export const inRange = (number, start, end) => {
  'worklet';
  return number >= Math.min(start, end) && number < Math.max(start, end);
};

/**
 * Convert degrees to radians
 * @private
 * @param {number} degree The degree to convert.
 * @returns {number}
 */
export const toRadian = (degree) => {
  'worklet';
  const radian = degree * (Math.PI / 180);
  return radian;
};

/**
 * Convert radians to degrees
 * @private
 * @param {number} radian The radian to convert.
 * @returns {number}
 */
export const toDegree = (radian) => {
  'worklet';
  const degree = radian * (180 / Math.PI);
  return degree;
};

export const getCenters = (internals) => {
  'worklet';
  const x = internals.x.value + internals.boxWidth.value / 2;
  const y = internals.y.value;
  return { x, y };
};

export const handleLeft = (params) => {
  'worklet';
  const x = params.ctx.startX + params._ev.translationX;
  const boxWidth = params.ctx.boxW - params._ev.translationX;
  return [boxWidth, x];
};

export const handleBottom = (params) => {
  'worklet';
  const boxHeight = params.ctx.boxH + params._ev.translationY;
  return boxHeight;
};

export const handleRight = (params) => {
  'worklet';
  const boxWidth = params.ctx.boxW + params._ev.translationX;
  return boxWidth;
};

export const handleTop = (params) => {
  'worklet';
  const y = params.ctx.startY + params._ev.translationY;
  const boxHeight = params.ctx.boxH - params._ev.translationY;
  return [y, boxHeight];
};
