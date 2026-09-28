import React from 'react'

function hashStyle(str: string) {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i)
    hash |= 0
  }
  return 's' + Math.abs(hash).toString(36)
}

function camelToKebab(str: string) {
  return str.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`)
}

export function styled(Tag: any) {
  return (styles: any) => {
    const styleString = JSON.stringify(styles)
    const className = hashStyle(styleString)
    
    let css = ''
    const { _hover, _media, _disabled, _focus, _groupHover, _mediaQuery, ...restStyles } = styles
    
    let baseCss = ''
    let desktopCss = ''
    
    for (const [key, value] of Object.entries(restStyles)) {
       const cssKey = camelToKebab(key)
       if (Array.isArray(value)) {
         if (value[0] !== undefined) baseCss += `${cssKey}: ${value[0]};\n`
         if (value[1] !== undefined) desktopCss += `${cssKey}: ${value[1]};\n`
       } else {
         baseCss += `${cssKey}: ${value};\n`
       }
    }

    css += `.${className} { ${baseCss} }`
    if (desktopCss) css += `\n@media (min-width: 768px) { .${className} { ${desktopCss} } }`
    
    if (_hover) {
      css += `\n.${className}:hover { `
      for (const [k, v] of Object.entries(_hover)) css += `${camelToKebab(k)}: ${v};\n`
      css += `}`
    }
    if (_disabled) {
      css += `\n.${className}:disabled { `
      for (const [k, v] of Object.entries(_disabled)) css += `${camelToKebab(k)}: ${v};\n`
      css += `}`
    }
    if (_focus) {
      css += `\n.${className}:focus, .${className}:focus-within { `
      for (const [k, v] of Object.entries(_focus)) css += `${camelToKebab(k)}: ${v};\n`
      css += `}`
    }
    if (_groupHover) {
      css += `\n.group:hover .${className} { `
      for (const [k, v] of Object.entries(_groupHover)) css += `${camelToKebab(k)}: ${v};\n`
      css += `}`
    }
    if (_media) {
       for (const [query, mediaStyles] of Object.entries(_media)) {
           css += `\n@media ${query} {\n  .${className} {\n`
           for (const [k, v] of Object.entries(mediaStyles as any)) css += `    ${camelToKebab(k)}: ${v};\n`
           css += `  }\n}`
       }
    }

    const StyledComponent = React.forwardRef<any, any>((props, ref) => {
      const { className: propsClassName, ...restProps } = props
      const combinedClassName = `${className} ${propsClassName || ''}`.trim()
      
      return (
        <>
          <style dangerouslySetInnerHTML={{ __html: css }} />
          <Tag ref={ref} className={combinedClassName} {...restProps} />
        </>
      )
    })
    
    StyledComponent.displayName = `Styled(${typeof Tag === 'string' ? Tag : Tag.displayName || Tag.name || 'Component'})`
    return StyledComponent as any
  }
}
