 import baseConstant from './baseConstant'

let TableUtil = {
  formatData: '',
}

TableUtil.formatData = (data, dataMapping) => {
  let result = new Array()
  data.map((e, index) => {
    let formattedData = {}
    formattedData.key = index+1
    formattedData.id = e.id
    for (let dataKey of Object.keys(dataMapping)) {
      if (dataMapping[dataKey] === 'Enum') {
        if (baseConstant.enumMapping[e[dataKey]]) {
          formattedData[dataKey] = baseConstant.enumMapping[e[dataKey]]
        } else {
          formattedData[dataKey] = e[dataKey]
        }
      } else if (dataMapping[dataKey] === 'Date') {
        /**
         * 时间匹配yyyy-MM-dd HH:mm:ss
         * @type {RegExp}
         */
        let regExp = new RegExp(/^[1-9]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])\s+(20|21|22|23|[0-1]\d):[0-5]\d:[0-5]\d$/)
        if (regExp.test(e[dataKey])) {
          formattedData[dataKey] = e[dataKey].substr(0, 10)
        } else {
          formattedData[dataKey] = e[dataKey]
        }
      } else if (dataMapping[dataKey] === 'Object') {
        let keys = dataKey.split('.')
        let temp
        keys.map(d => {
          if (!temp) {
            temp = e[d]
          } else {
            temp = temp[d]
          }
        })
        formattedData[dataKey] = temp
      } else if (dataMapping[dataKey] === 'Objects') {
        let dataKeys = dataKey.split(',')
        let temps
        dataKeys.map((dk) => {
          let keys = dk.split('.')
          let temp
          for (let i = 0; i < keys.length; i++) {
            if (!e[keys[0]]) {
              break
            } else {
              if (!temp) {
                temp = e[keys[i]]
              } else {
                temp = temp[keys[i]]
              }
            }
          }
          if (!temps) {
            temps = temp
          }
        })
        formattedData[dataKey] = temps
      } else if (dataMapping[dataKey] === 'ObjectEnum') {
        let keys = dataKey.split('.')
        let temp
        keys.map(d => {
          if (!temp) {
            temp = e[d]
          } else {
            temp = temp[d]
          }
        })
        if (baseConstant.enumMapping[temp]) {
          formattedData[dataKey] = baseConstant.enumMapping[temp]
        } else {
          formattedData[dataKey] = e[temp]
        }
      } else if (dataMapping[dataKey] === 'Boolean') {
        if (e[dataKey]) {
          formattedData[dataKey] = '是'
        } else {
          formattedData[dataKey] = '否'
        }
      } else {
        formattedData[dataKey] = cutStr(e[dataKey], 2000)
      }
    }
    result.push(formattedData)
  })
  return result
}

let cutStr = (str, len) => {
  if (str) {
    let str_cut = new String()
    if (str && str.length < len) {
      return str
    } else {
      if (str.substring) {
        str_cut = str.substring(0, len)
        return str_cut.concat('...')
      } else {
        return str
      }
    }
  } else {
    return str
  }
}

export default TableUtil
