const math = {
  /**
   * Returns the sum of the terms where each term can either be a number or a complex number.
   * If all terms are numbers, then the result is a number.
   */
  add(...terms) {
    var sum = 0;
    var hasComplex = false;
    for (var i = 0; i < terms.length; i++) {
      if (typeof terms[i] === "number") {
        sum += terms[i];
      } else {
        hasComplex = true;
        break;
      }
    }
    if (hasComplex) {
      sum = { re: 0, im: 0 };
      for (var i = 0; i < terms.length; i++) {
        if (typeof terms[i] === "number") {
          sum.re += terms[i];
        } else {
          sum.re += terms[i].re;
          sum.im += terms[i].im;
        }
      }
    }
    return sum;
  },
  /**
   * Returns the product of the terms where each term can either be a number or a complex number.
   * If all terms are numbers, then the result is a number.
   */
  multiply(...terms) {
    var product = 1;
    var hasComplex = false;
    for (var i = 0; i < terms.length; i++) {
      if (typeof terms[i] === "number") {
        product *= terms[i];
      } else {
        hasComplex = true;
        break;
      }
    }
    if (hasComplex) {
      product = { re: 1, im: 0 };
      for (var i = 0; i < terms.length; i++) {
        if (typeof terms[i] === "number") {
          product.re *= terms[i];
        } else {
          var re = product.re * terms[i].re - product.im * terms[i].im;
          var im = product.re * terms[i].im + product.im * terms[i].re;
          product.re = re;
          product.im = im;
        }
      }
    }
    return product;
  },
  /** Returns e^a where a is a either a number or a complex number.
   * If a is a number, then the result is a number.
   */
  exp(a) {
    if (typeof a === "number") {
      return Math.exp(a);
    } else {
      var re = Math.exp(a.re) * Math.cos(a.im);
      var im = Math.exp(a.re) * Math.sin(a.im);
      return { re: re, im: im };
    }
  },
  /** Returns the value of pi */
  pi: Math.PI,
  /** Returns the imaginary unit */
  i: { re: 0, im: 1 },
};

export default math;
