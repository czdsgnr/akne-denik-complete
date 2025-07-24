import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import { Label } from '../ui/label'
import DailyContentEditor from '../DailyContentEditor'

function ContentPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Editor denního obsahu</h1>
        <p className="text-gray-600 mt-1">Spravuj motivace a úkoly pro celý rok</p>
      </div>
      
      {/* DailyContentEditor komponenta už existuje, tak ji použijeme */}
      <DailyContentEditor />
    </div>
  )
}

export default ContentPage