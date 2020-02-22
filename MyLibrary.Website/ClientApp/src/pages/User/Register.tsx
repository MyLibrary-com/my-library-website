import React from 'react';
import { Formik } from 'formik';
import * as yup from 'yup';
import {
    Paper, Grid, Button, WithStyles, withStyles, createStyles,
} from '@material-ui/core';
import Axios from 'axios';
import { WithSnackbarProps, withSnackbar } from 'notistack';
import { RouteComponentProps, withRouter } from 'react-router';
import { compose } from 'recompose';
import InputTextField from '../../components/shared/InputTextField';
import { RegisterInfo } from '../../interfaces/registerInfo';
import YupExtensions from '../../util/YupExtensions';
import PageHeading from '../../components/shared/PageHeading';
import UserHelper from './UserHelper';

interface RegisterState {
    registrationInfo: RegisterInfo;
}

interface RegisterProps extends RouteComponentProps<{}> {
    classes: any;
    enqueueSnackbar: any;
    closeSnackbar: any;
}

const useStyles = createStyles({
    paper: {
        paddingTop: '20px',
        paddingLeft: '40px',
        paddingRight: '20px',
    },
    formButton: {
        marginBottom: '10px',
        marginRight: '10px',
        float: 'right',
    },
});

export class Register extends React.Component<
    RegisterProps
    & WithStyles<typeof useStyles>
    & WithSnackbarProps
    , RegisterState> {
    constructor(props: RegisterProps) {
        super(props);
        this.register = this.register.bind(this);
        this.onChange = this.onChange.bind(this);
        this.renderErrorSnackbar = this.renderErrorSnackbar.bind(this);
        this.renderSuccessSnackbar = this.renderSuccessSnackbar.bind(this);
        this.renderWarningSnackbar = this.renderWarningSnackbar.bind(this);

        this.state = {
            registrationInfo: {
                username: '',
                password: '',
                confirmationPassword: '',
            },
        };
    }

    onChange(key: string, value: any): void {
        const prevState = this.state;
        this.setState({
            registrationInfo: {
                ...prevState.registrationInfo,
                [key]: value,
            },
        });
    }

    checkUserIsUnique(username: string) {
        const helper = new UserHelper();
        helper.CheckUserIsUnique(username).then((result) => {
            if (result === null || result === undefined) {
                this.renderErrorSnackbar('Unable to check username, please contact admin');
            } else if (result === true) {
                this.renderWarningSnackbar('Username is taken please choose another');
            } else if (result === false) {
                this.renderSuccessSnackbar('Username is availiable');
            }
        });
    }

    register(registrationInfo: RegisterInfo, validateForm: Function) {
        validateForm()
            .then((formKeys: any) => {
                if (Object.keys(formKeys).length === 0) {
                    Axios.post('api/user/', registrationInfo)
                        .then((response) => {
                            if (response.status === 200) {
                                this.renderSuccessSnackbar('Registration successful');
                                this.props.history.push('/');
                            }
                        })
                        .catch((error) => {
                            if (error.response.status === 400) {
                                this.renderWarningSnackbar(error.data);
                            } else {
                                this.renderErrorSnackbar('Unable to login in user please contact admin');
                            }
                        });
                }
            });
    }

    renderErrorSnackbar(message: string): void {
        this.props.enqueueSnackbar(message, {
            variant: 'error',
        });
    }

    renderSuccessSnackbar(message: string): void {
        this.props.enqueueSnackbar(message, {
            variant: 'success',
        });
    }

    renderWarningSnackbar(message: string): void {
        this.props.enqueueSnackbar(message, {
            variant: 'warning',
        });
    }

    render(): JSX.Element {
        return (
            <Paper className={this.props.classes.paper}>
                <PageHeading headingText="Sign Up" />
                <Formik
                    initialValues={this.state.registrationInfo}
                    onSubmit={(values) => {
                        console.log(values);
                    }}
                    validationSchema={() => {
                        yup.addMethod(yup.string, 'equalTo', YupExtensions.equalTo);
                        return yup.object().shape({
                            username: yup.string()
                                .required('You must enter a username to register'),
                            password: yup.string()
                                .required('You must enter your a password to register')
                                .matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, 'Password must be at least 6 characters long and contain one number and uppercase character.'),
                            confirmationPassword: yup.string()
                                .oneOf([yup.ref('password')], 'Confirm password must matched password')
                                .required('You must enter your password confirmation to register'),
                        });
                    }}
                >
                    {({
                        values,
                        errors,
                        handleChange,
                        handleBlur,
                        validateForm,
                    }) => (
                            <Grid container item xs={12}>
                                <Grid item xs={12}>
                                    <InputTextField
                                        label="Username"
                                        required
                                        type="text"
                                        keyName="username"
                                        value={values.username}
                                        onChange={handleChange}
                                        onBlur={() => {
                                            this.checkUserIsUnique(values.username);
                                        }}
                                        error={!!(errors.username)}
                                        errorMessage={errors.username}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <InputTextField
                                        label="Password"
                                        required
                                        type="password"
                                        keyName="password"
                                        value={values.password}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={!!(errors.password)}
                                        errorMessage={errors.password}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <InputTextField
                                        label="Confirm Password"
                                        required
                                        type="password"
                                        keyName="confirmationPassword"
                                        value={values.confirmationPassword}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={!!(errors.confirmationPassword)}
                                        errorMessage={errors.confirmationPassword}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Button
                                        className={this.props.classes.formButton}
                                        variant="contained"
                                        color="primary"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            this.register(values, validateForm);
                                        }}
                                    >
                                        Register
                                    </Button>
                                    <Button
                                        className={this.props.classes.formButton}
                                        variant="contained"
                                        color="secondary"
                                        onClick={() => {
                                            this.props.history.push('/');
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                </Grid>
                            </Grid>
                        )}
                </Formik>
            </Paper>
        );
    }
}

export default compose<RegisterProps, {}>(
    withStyles(useStyles),
    withRouter,
    withSnackbar,
)(Register);
