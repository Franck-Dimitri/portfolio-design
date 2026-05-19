import { useState, useEffect } from 'react';
import { useForm } from '@inertiajs/react';

export default function ServiceModal(show, close, open, service = null, onSuccess){
    
    const [tools, setTools] = useState(['']);
    const [livrables, setLivrables] = useState(['']);
    const [features, setFeatures] = useState(['']);

    const {data, setData, post, put, processing, errors, reset} = useForm({
        titre: '',
        desciption: '',
        cathegorie: '',
        prix: '',
        starting_price: '',
        delaie_livraison: '',

        outils: [],
        livrables: [],
        features: [],

        is_featured: false,
        is_published: false,

    })

    useEffect(() => {
        if (service) {
            setData({
                titre: service.titre || '',
                desciption: service.desciption || '',
                cathegorie: service.cathegorie || '',
                prix: service.prix || '',
                starting_price: service.starting_price || '',
                delaie_livraison: service.delaie_livraison || '',
                outils: service.outils || [],
                livrables: service.livrables || [],
                features: service.features || [],
            });
            setTools(service.outils?.length ? service.outils : ['']);
            setLivrables(service.livrables?.length ? service.livrables : ['']);
            setFeatures(service.features?.length ? service.features : ['']);
        } else{
            reset();
            setTools(['']);
            setLivrables(['']);        
            setFeatures(['']);        
        }
    }, [service, show]);

    const handleSubmit = (e) =>{
        e.preventDefault();

        const formData = new FormData();
        formData.append('titre', data.titre);
        formData.append('description', data.description);
        formData.append('cathegorie', data.cathegorie);
        formData.append('prix', data.prix);
        formData.append('starting_price', data.starting_price);
        formData.append('delaie_livraison', data.delaie_livraison);

        formData.append('outils', JSON.stringify(data.outils));
        formData.append('livrables', JSON.stringify(data.livrables));
        formData.append('features', JSON.stringify(data.features));

        if (service){
            formData.append('_method', 'PUT');
            post(route('admin.services.update', service.id), {
                data: formData,
                onSuccess: () => {
                    onSuccess();
                    onclose();
                    reset();
                }
            })
        }else{
            post(route('admin.services.store'), {
                data: formData,
                onSuccess: () => {
                    onSuccess();
                    onclose();
                    reset();
                }
            });
        }

    };

    const addTools = () => {
        setTools([...tools, '']);
    }

    const removeTool = (index) => {
        const newTools = tools.filter((_, i) => i !== index);
        setTools(newTools);
        setData('outils', newTools.filter(tool => tool.trim()));
    };

    const updateTool = (index, value) => {
        const newTools = [...tools];
        newTools[index] = value;
        setTools(newTools);
        setData('outils', newTools.filter(tool => tool.trim()));
    };


    const addLivrables = () => {
        setLivrables([...livrables, '']);
    }

    const removeLivrables = (index) => {
        const newLivrables = livrables.filter((_, i) => i !== index);
        setLivrables(newLivrables);
        setData('livrables', newLivrables.filter(livrables => livrables.trim()));
    };

    const updateLivrables = (index, value) => {
        const newLivrables = [...livrables];
        newLivrables[index] = value;
        setLivrables(newLivrables);
        setData('livrables', newLivrables.filter(livrables => livrables.trim()));
    };

    const addFeatures = () => {
        addFeatures([...livrables, '']);
    }

    const removeFeatures= (index) => {
        const newFeatures = features.filter((_, i) => i !== index);
        setFeatures(newFeatures);
        setData('features', newFeatures.filter(features => newFeatures.trim()));
    };

    const updateFeatures = (index, value) => {
        const newFeatures = [...features];
        newFeatures[index] = value;
        setFeatures(newFeatures);
        setData('features', newFeatures.filter(features => features.trim()));
    };

    if (!show) return null;



}