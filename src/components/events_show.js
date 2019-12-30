import React, { Component } from 'react';

import { getEvent, deleteEvent, putEvent } from '../actions'
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form'
import { Link } from 'react-router-dom'

class EventsShow extends Component {
  constructor(props) {
    super(props)
    this.onSubmit = this.onSubmit.bind(this)
    this.onDeleteClick = this.onDeleteClick.bind(this)
  }

  componentDidMount() {
    const { id } = this.props.match.params
    if (id) this.props.getEvent(id)
  }

  renderField(field) {
    const { input, label, type, meta: { touched, error } } = field

    return (
      <div>
        <input {...input} placeholder={label} type={type}></input>
        {touched && error && <span>{error}</span>}
      </div>
    )
  }

  async onDeleteClick() {
    const { id } = this.props.match.params
    console.log(id)
    await this.props.deleteEvent(id)
    this.props.history.push('/')
  }

  async onSubmit(values) {
    await this.props.putEvent(values)
    this.props.history.push('/')
  }

  render() {
    const { handleSubmit, pristine, submitting, invalid } = this.props
    console.log(submitting)

    return (
      <form onSubmit={handleSubmit(this.onSubmit)}>
        <div>
          <Field label='Title' name='title' type='text' component={this.renderField} />
        </div>
        <div>
          <Field label='Body' name='body' type='text' component={this.renderField}></Field>
        </div>

        <div>
          <input type='submit' value='Submit' disabled={ pristine || submitting || invalid }></input>
          <Link to='/' >Cancel</Link>
          <Link to='/' onClick={this.onDeleteClick}>Delete</Link>
        </div>
      </form>
    )
  }
}

const mapDispatchToProps = ({ deleteEvent, getEvent, putEvent })
const mapStateToProps = (state, ownProps) => {
  const event = state.events[ownProps.match.params.id]
  return { initialValues: event,  event}
}

const validate = values => {
  const errors = {}

  if (!values.title) errors.title = 'enter title, please.'
  if (!values.body) errors.body = 'enter body, please.'

  return errors
}

export default connect(mapStateToProps, mapDispatchToProps)(
  reduxForm({ validate, form: 'eventShowForm', enableReinitialize: true })(EventsShow)
)