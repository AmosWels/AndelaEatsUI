/* eslint-disable no-undef */
import React from 'react';
import { shallow, mount } from 'enzyme';
import { Users, mapStateToProps } 
  from '../../../../components/Admin/Users/AdminUsers';

const props = {
  adminUsers: [{ name: 'miriam', email: "mim@gmail.com" }],
  message: "",
  userEmail: "",
  createAdminUser: jest.fn().mockImplementation(() => Promise.resolve()),
  getAllAdminUsers: jest.fn(),
  loading: false
};

const wrapper = shallow(<Users {...props} />);

describe('Users Component', () => {
  it('should render correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should render loader component', () => {
    const loaderProps = { ...props, loading: true };
    const compWrapper = mount(<Users {...loaderProps} />);
    expect(compWrapper).toMatchSnapshot();
  });

  it('should render an empty component', () => {
    const emptyProps = { ...props, adminUsers: [] };
    const compWrapper = mount(<Users {...emptyProps} />);
    expect(compWrapper).toMatchSnapshot();
  });

  it('should handle submit', () => {
    const event = {
      target: {
        elements: {
          userEmail: {
            value: "miriam@gmail.com"
          },
        }
      },
    };

    wrapper.update();
    wrapper.find('form').simulate('submit',
      event
    );

    expect(props.createAdminUser).toBeCalled();
  });

  it('should change email address', () => {
    wrapper.instance().onChange({ target: { name: 'emailAdress', value: 'welike.amos@gmail.com' } });
    expect(wrapper.instance().state.emailAdress).toEqual('welike.amos@gmail.com');
  });

  describe('mapStateToProps', () => {
    it('should map Users to state', () => {
      const initialState = {
        user: {
          adminUsers: []
        }
      };
    
      expect(mapStateToProps(initialState).adminUsers).toEqual([]);
    });
  });
});
