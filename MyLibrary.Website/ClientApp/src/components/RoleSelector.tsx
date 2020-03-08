import React from 'react';
import {
    Grid, InputLabel, Select, MenuItem, FormControl, makeStyles, Input, Chip, Theme,
} from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) => ({
    roleChipSection: {
        paddingTop: '10px',
        width: '100%',
    },
    roleChip: {
        marginRight: '5px',
    },
    errorMessage: {
        paddingBottom: '20px',
        color: 'red',
        fontFamily: theme.typography.fontFamily,
    },
}));

const RoleSelector: React.FC<{
    roles: Array<string>;
    selectedRoles: Array<string>;
    updateUserRoles: Function;
    error?: boolean;
    errorMessage?: string;
}> = ({
    roles, selectedRoles, updateUserRoles, error, errorMessage,
}) => {
        const classes = useStyles();
        const inputLabel = React.useRef<HTMLLabelElement>(null);

        const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
            updateUserRoles(event.target.value);
        };

        return (
            <Grid container item xs={12}>
                <Grid item xs={12}>
                    <FormControl className={classes.roleChipSection}>
                        <InputLabel ref={inputLabel} id="roleSelectLabel">Roles</InputLabel>
                        <Select
                            labelId="roleSelectLabel"
                            id="roleSelect"
                            multiple
                            name="roles"
                            className={classes.roleChipSection}
                            value={selectedRoles}
                            onChange={handleChange}
                            input={<Input id="selectMultipleRoles" />}
                            renderValue={(selected) => (
                                <div className={classes.roleChip}>
                                    {(selected as string[]).map((value) => (
                                        <Chip color="primary" key={value} label={value} className={classes.roleChip} />
                                    ))}
                                </div>
                            )}
                        >
                            {roles.map((role) => (
                                <MenuItem key={role} value={role}>
                                    {role}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <div className={classes.errorMessage}>{error ? errorMessage : ''}</div>
                </Grid>
            </Grid>
        );
    };

export default RoleSelector;
