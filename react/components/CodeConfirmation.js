import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Input, Button } from 'vtex.styleguide'
import { injectIntl, intlShape } from 'react-intl'
import { graphql } from 'react-apollo'

import accessKeySignIn from '../mutations/accessKeySignIn.gql'

import { translate } from '../utils'

/** CodeConfirmation tab component. Receive the code from an input and call the signIn mutation */
class CodeConfirmation extends Component {
  constructor(props) {
    super(props)
    this.state = { isLoading: false }
  }

  handleInputChange = event => {
    this.props.onStateChange({ code: event.target.value })
  }

  handleOnSubmit = () => {
    const { accessKeySignIn, email, code, onStateChange, next } = this.props
    if (code !== '') {
      this.setState({ isLoading: true })
      accessKeySignIn({
        variables: {
          authInput: { email, code }
        }
      }).then(
        ({ data }) => {
          if (data && data.accessKeySignIn) {
            this.setState({ isLoading: false })
            onStateChange({ step: next })
          }
        }, err => {
          console.log(err)
        })
    }
  }

  render() {
    const {
      goBack,
      confirm,
      intl,
      onStateChange,
      titleLabel,
      previous,
      code,
    } = this.props
    const { isLoading } = this.state

    return (
      <div className="vtex-login__code-confirmation w-100">
        <h3 className="fw5 ttu br2 tc fw4 v-mid pv3 ph5 f6 light-marine">
          {translate(titleLabel, intl)}
        </h3>
        <Input value={code} onChange={this.handleInputChange} />
        <div className="mt5 min-h-2 b--light-gray">
          <div className="fl mt4">
            <Button variation="secondary" size="small"
              onClick={() => onStateChange({ step: previous })}>
              <div className="f7">{translate(goBack, intl)}</div>
            </Button>
          </div>
          <div className="fr mt4">
            {isLoading ? (
              <Button size="small" disabled isLoading={isLoading}>
                <div className="f7">{translate(confirm, intl)}</div>
              </Button>
            ) : (
                <Button size="small" onClick={() => this.handleOnSubmit()}>
                  <div className="f7">{translate(confirm, intl)}</div>
                </Button>
              )}
          </div>
        </div>
      </div>
    )
  }
}

CodeConfirmation.propTypes = {
  /** Email set on state */
  email: PropTypes.string.isRequired,
  /** Code set on state */
  code: PropTypes.string.isRequired,
  /** Next step */
  next: PropTypes.number.isRequired,
  /** Previous step */
  previous: PropTypes.number.isRequired,
  /** Title that will be shown on top */
  titleLabel: PropTypes.string.isRequired,
  /** Locales go back string id */
  goBack: PropTypes.string.isRequired,
  /** Locales confirm string id */
  confirm: PropTypes.string.isRequired,
  /** Function to change de active tab */
  onStateChange: PropTypes.func.isRequired,
  /** Graphql property to call a mutation */
  accessKeySignIn: PropTypes.func.isRequired,
  /** Intl object*/
  intl: intlShape,
}

export default injectIntl(
  graphql(accessKeySignIn, { name: 'accessKeySignIn' })(CodeConfirmation)
)