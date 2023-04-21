// From https://github.com/Semantic-Org/Semantic-UI/issues/4805
import React from 'react'
import { Button } from 'semantic-ui-react'
import './style.css'

const ButtonLink = ({
  className = '',
  ...props
}) => <Button
  basic
  color='blue'
  className={['link', className].join(' ')}
  {...props}
/>

export default ButtonLink
