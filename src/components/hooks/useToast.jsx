import { toast } from "react-toastify";

const useToast = () => {
    const showToast = (message, type = 'info') => {
        const toastMethods = {
            success: toast.success,
            error: toast.error,
            warning: toast.warning,
            info: toast.info
        };
        (toastMethods[type] || toast.info)(message);
    };

    return { showToast };
};

export default useToast;