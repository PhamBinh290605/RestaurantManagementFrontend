import { use, useState } from "react";
import api from "../../../../api";
import { toast } from "sonner";

const MenuPage = () => {

    const [menuItems , setMenuItems] = useState([]);
    const [loading , setLoading] = useState(true) ;

    useEffect(() => {
        getMenuItems();
    },[]);

    const getMenuItems = async () => {
        try {
            setLoading(true);
            const res = await api.get('/menuitems');
            const data = res.data ; 
            setMenuItems(data.result) ;
        }catch (error){
            console.error('Error fetching menu items:', error);
            toast.error('Failed to fetch menu items');
        }finally{
            setLoading(false);
        }
    }
    
    return (
        <div>
            <h1>Menu Management</h1>
        </div>
    );
};

export default MenuPage;