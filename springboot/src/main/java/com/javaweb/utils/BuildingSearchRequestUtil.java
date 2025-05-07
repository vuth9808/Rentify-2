package com.javaweb.utils;

public class BuildingSearchRequestUtil
{
    public static <T> T getObject(Object key, Class<T> tClass)
    {
        if(key != null)
        {
            if(tClass.getTypeName().equals("java.lang.Long"))
            {
                key = key != "" ? Long.valueOf(key.toString()) : null;
            }

            else if(tClass.getTypeName().equals("java.lang.Integer"))
            {
                key = key != "" ? Integer.valueOf(key.toString()) : null;
            }

            else if(tClass.getTypeName().equals("java.lang.String"))
            {
                key = key != "" ? key : null;
            }

            return tClass.cast(key);
        }
        return null;
    }
}
