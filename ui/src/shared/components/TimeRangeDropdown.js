import React, {Component, PropTypes} from 'react'
import classnames from 'classnames'
import moment from 'moment'

import OnClickOutside from 'shared/components/OnClickOutside'
import FancyScrollbar from 'shared/components/FancyScrollbar'
import CustomTimeRangeOverlay from 'shared/components/CustomTimeRangeOverlay'

import timeRanges from 'hson!shared/data/timeRanges.hson'
import {DROPDOWN_MENU_MAX_HEIGHT} from 'shared/constants/index'

class TimeRangeDropdown extends Component {
  constructor(props) {
    const {lower, upper} = props.selected

    super(props)

    this.state = {
      autobind: false,
      isOpen: false,
      isCustomTimeRangeOpen: false,
      customTimeRange:
        moment(props.selected.upper).isValid() &&
        moment(props.selected.lower).isValid()
          ? {
              lower,
              upper,
            }
          : {
              lower: '',
              upper: '',
            },
    }
  }

  findTimeRangeInputValue = ({upper, lower}) => {
    if (upper && lower) {
      const format = t =>
        moment(t.replace(/\'/g, '')).format('YYYY-MM-DD HH:mm')
      return `${format(lower)} - ${format(upper)}`
    }

    const selected = timeRanges.find(range => range.lower === lower)
    return selected ? selected.inputValue : 'Custom'
  }

  handleClickOutside = () => {
    this.setState({isOpen: false})
  }

  handleSelection = timeRange => () => {
    this.props.onChooseTimeRange(timeRange)
    this.setState({isOpen: false})
  }

  toggleMenu = () => {
    this.setState({isOpen: !this.state.isOpen})
  }

  showCustomTimeRange = () => {
    this.setState({isCustomTimeRangeOpen: true})
  }

  handleApplyCustomTimeRange = customTimeRange => {
    this.props.onChooseTimeRange({...customTimeRange})
    this.setState({customTimeRange, isOpen: false})
  }

  handleToggleCustomTimeRange = () => {
    this.setState({isCustomTimeRangeOpen: !this.state.isCustomTimeRangeOpen})
  }

  handleCloseCustomTimeRange = () => {
    this.setState({isCustomTimeRangeOpen: false})
  }

  render() {
    const {selected, preventCustomTimeRange} = this.props
    const {isOpen, customTimeRange, isCustomTimeRangeOpen} = this.state
    const isRelativeTimeRange = selected.upper === null

    return (
      <div className="time-range-dropdown">
        <div
          className={classnames('dropdown', {
            'dropdown-160': isRelativeTimeRange,
            'dropdown-290': !isRelativeTimeRange,
            open: isOpen,
          })}
        >
          <div
            className="btn btn-sm btn-default dropdown-toggle"
            onClick={this.toggleMenu}
          >
            <span className="icon clock" />
            <span className="dropdown-selected">
              {this.findTimeRangeInputValue(selected)}
            </span>
            <span className="caret" />
          </div>
          <ul className="dropdown-menu">
            <FancyScrollbar
              autoHide={false}
              autoHeight={true}
              maxHeight={DROPDOWN_MENU_MAX_HEIGHT}
            >
              {preventCustomTimeRange
                ? null
                : <div>
                    <li className="dropdown-header">Absolute Time Ranges</li>
                    <li
                      className={
                        isCustomTimeRangeOpen
                          ? 'active dropdown-item custom-timerange'
                          : 'dropdown-item custom-timerange'
                      }
                    >
                      <a href="#" onClick={this.showCustomTimeRange}>
                        Custom Date Picker
                      </a>
                    </li>
                  </div>}
              <li className="dropdown-header">
                {preventCustomTimeRange ? '' : 'Relative '}Time Ranges
              </li>
              {timeRanges.map(item => {
                return (
                  <li className="dropdown-item" key={item.menuOption}>
                    <a href="#" onClick={this.handleSelection(item)}>
                      {item.menuOption}
                    </a>
                  </li>
                )
              })}
            </FancyScrollbar>
          </ul>
        </div>
        {isCustomTimeRangeOpen
          ? <CustomTimeRangeOverlay
              onApplyTimeRange={this.handleApplyCustomTimeRange}
              timeRange={customTimeRange}
              isVisible={isCustomTimeRangeOpen}
              onToggle={this.handleToggleCustomTimeRange}
              onClose={this.handleCloseCustomTimeRange}
            />
          : null}
      </div>
    )
  }
}

const {bool, func, shape, string} = PropTypes

TimeRangeDropdown.propTypes = {
  selected: shape({
    lower: string,
    upper: string,
  }).isRequired,
  onChooseTimeRange: func.isRequired,
  preventCustomTimeRange: bool,
}

export default OnClickOutside(TimeRangeDropdown)
