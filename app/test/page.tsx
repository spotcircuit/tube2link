'use client'

import RichTextEditor from '../../components/RichTextEditor'

export default function TestPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-2xl font-bold mb-8">Rich Text Editor Test</h1>
      
      <RichTextEditor 
        content="<h2>Test Heading</h2><p>This is some test content to see how the editor looks. Try editing this text and using the formatting options above.</p><ul><li>You can make text <strong>bold</strong></li><li>Or make it <em>italic</em></li><li>And create bullet lists like this one</li></ul>"
        onReturn={() => alert('Return clicked')}
        onCopy={() => alert('Copy clicked')}
        className="max-w-4xl mx-auto"
      />
    </div>
  )
}
