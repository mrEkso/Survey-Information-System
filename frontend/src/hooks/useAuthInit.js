import { useGetMeQuery } from '@services/store/api/authApi';
import { logout, selectIsAuth, selectUser, setUser } from '@services/store/slices/userSlice';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export default function useAuthInit() {
    const dispatch = useDispatch();
    const token = useSelector(state => state.user.token);
    const isAuth = useSelector(selectIsAuth);
    const user = useSelector(selectUser);
    const { data, error } = useGetMeQuery(undefined, { skip: !token || isAuth || !!user });

    useEffect(() => {
        if (token && data) {
            dispatch(setUser({ user: data, token, isAuth: true }));
        } else if (token && error) {
            dispatch(logout());
        }
    }, [token, data, error, dispatch]);
} 