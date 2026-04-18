import React from 'react'
import DefaultLabel from './DefaultLabel'

function TextArea({field , value , onChange}) {
    return (
        <div className="flex flex-col gap-1 p-1">
            <DefaultLabel label={field.label} required={field.required} />
            <textarea
                name={field.name}
                rows={field.rows || 4}
                value={value}
                onChange={onChange}
                placeholder={field.placeholder}
                className="rounded border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-100"
            />
        </div>
    )
}

export default TextArea