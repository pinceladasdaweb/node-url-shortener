class Base62 {
  constructor () {
    this.charset = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
  }

  encode (integer) {
    if (integer === 0) {
      return 0
    }

    let s = []

    while (integer > 0) {
      s = [this.charset[integer % 62], ...s]
      integer = Math.floor(integer / 62)
    }

    return s.join('')
  }

  decode (chars) {
    return chars.split('').reverse().reduce((prev, curr, i) => prev + (this.charset.indexOf(curr) * (62 ** i)), 0)
  }
}

module.exports = new Base62()
