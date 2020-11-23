export const hexToBase64Img = (hexStr: string, type?: string) => {
  if (!hexStr) {
    return ''
  }
  const a = []
  for (let i = 0, len = hexStr.length; i < len; i += 2) {
    a.push(parseInt(hexStr.substr(i, 2), 16))
  }
  let binary = ''
  const bytes = new Uint8Array(a)
  const len = bytes.byteLength
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  const imgBtoa = window.btoa(binary)
  type = type || 'image/jpeg'
  return 'data:' + type + ';base64,' + imgBtoa
}

export const htmlSubstr = (src: string, length: number, suffix: string) => {
  if (length >= src.length) return src
  let str = '', // 最终内容
    tag = '', // current tag contents (used during content reading)
    i = 0, // position in source
    c = '', // current char (used during content reading)
    end = 0, // ending position of tag (used during content reading)
    cnt = 0, // content size
    tagTree: string[] = [] // open tags

  const tagStrip = (content: string) => {
    const index = tag.indexOf(' ') // check for space (ex.: <span a="b">)
    if (index === -1) { // no space (ex.: <span>)
      return content.slice(1, -1)
    }
    return content.slice(1, index)
  }

  for (; i < src.length; i++) {
    if (cnt > length) break
    c = src.charAt(i)
    if (c === '<') {
      end = src.slice(i).indexOf('>')
      if (end === -1) { // Check for incomplete tag
        return str
      }
      end += i + 1
      tag = src.slice(i, end) // Read tag contents
      str += tag
      if (tag.charAt(1) === '/') {
        // Closing tag
        tagTree = tagTree.slice(0, -1)
      } else {
        // New tag
        tagTree.push(tagStrip(tag))
      }
    } else {
      str += c
      cnt++
    }
  }
  if (tagTree.length > 0) {
    for (i = tagTree.length - 1; i >= 0; i--) {
      str += '</' + tagTree[i] + '>'
    }
  }
  // while (cnt < length && i < len) {
  // }
}
