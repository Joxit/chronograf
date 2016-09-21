package models

// This file was generated by the swagger tool.
// Editing this file might prove futile when you re-run the swagger generate command

import (
	strfmt "github.com/go-openapi/strfmt"
	"github.com/go-openapi/swag"

	"github.com/go-openapi/errors"
)

/*Users users

swagger:model Users
*/
type Users struct {

	/* users
	 */
	Users []*User `json:"users,omitempty"`
}

// Validate validates this users
func (m *Users) Validate(formats strfmt.Registry) error {
	var res []error

	if err := m.validateUsers(formats); err != nil {
		// prop
		res = append(res, err)
	}

	if len(res) > 0 {
		return errors.CompositeValidationError(res...)
	}
	return nil
}

func (m *Users) validateUsers(formats strfmt.Registry) error {

	if swag.IsZero(m.Users) { // not required
		return nil
	}

	for i := 0; i < len(m.Users); i++ {

		if swag.IsZero(m.Users[i]) { // not required
			continue
		}

		if m.Users[i] != nil {

			if err := m.Users[i].Validate(formats); err != nil {
				return err
			}
		}

	}

	return nil
}