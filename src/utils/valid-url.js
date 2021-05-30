class ValidUrl {
  splitUri (uri) {
    return uri.match(/(?:([^:/?#]+):)?(?:\/\/([^/?#]*))?([^?#]*)(?:\?([^#]*))?(?:#(.*))?/)
  }

  isValid (value) {
    if (!value) {
      return
    }

    if (/[^a-z0-9:/?#[\]@!$&'()*+,;=.\-_~%]/i.test(value)) {
      return
    }

    if (/%[^0-9a-f]/i.test(value)) {
      return
    }

    if (/%[0-9a-f](:?[^0-9a-f]|$)/i.test(value)) {
      return
    }

    const [, scheme, authority, path, query, fragment] = this.splitUri(value)

    if (!(scheme && scheme.length && path.length >= 0)) {
      return
    }

    if (authority && authority.length) {
      if (!(path.length === 0 || /^\//.test(path))) {
        return
      }
    } else {
      if (/^\/\//.test(path)) {
        return
      }
    }

    if (!/^[a-z][a-z0-9+\-.]*$/.test(scheme.toLowerCase())) {
      return
    }

    return `${scheme}:${authority && authority.length ? `//${authority}` : ''}${path}${query && query.length ? `?${query}` : ''}${fragment && fragment.length ? `#${fragment}` : ''}`
  }
}

module.exports = new ValidUrl()
