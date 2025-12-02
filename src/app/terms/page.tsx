'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, Shield, AlertTriangle, User, Globe, Clock, Check } from 'lucide-react'
import { useLanguage } from '@/contexts/language-context'

export default function TermsOfServicePage() {
  const { t } = useLanguage()

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Navigation */}
      <div className="flex items-center justify-between border-b pb-4">
        <a 
          href="/login" 
          className="flex items-center space-x-2 text-primary hover:text-primary/80 transition-colors"
        >
          <FileText className="h-5 w-5" />
          <span className="font-semibold">ads169th System</span>
        </a>
        <div className="flex items-center space-x-4 text-sm">
          <a 
            href="/terms" 
            className="text-primary font-medium"
          >
            {t('terms.title')}
          </a>
          <a 
            href="/privacy" 
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            {t('privacy.title')}
          </a>
        </div>
      </div>

      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-3">
          <FileText className="h-12 w-12 text-primary" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            {t('terms.title')}
          </h1>
        </div>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          {t('terms.subtitle')}
        </p>
        <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>{t('terms.lastUpdated')}: {new Date().toLocaleDateString('th-TH')}</span>
        </div>
      </div>

      {/* Acceptance */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-3">
            <Check className="h-6 w-6 text-primary" />
            <div>
              <CardTitle>{t('terms.acceptance.title')}</CardTitle>
              <CardDescription>{t('terms.acceptance.description')}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            {t('terms.acceptance.content')}
          </p>
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">
              {t('terms.acceptance.note')}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Service Description */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-3">
            <Globe className="h-6 w-6 text-primary" />
            <div>
              <CardTitle>{t('terms.service.title')}</CardTitle>
              <CardDescription>{t('terms.service.description')}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-semibold text-primary">{t('terms.service.features.title')}</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start space-x-2">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                  <span>{t('terms.service.features.authentication')}</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                  <span>{t('terms.service.features.management')}</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                  <span>{t('terms.service.features.monitoring')}</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                  <span>{t('terms.service.features.reporting')}</span>
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-primary">{t('terms.service.availability.title')}</h4>
              <p className="text-sm text-muted-foreground">
                {t('terms.service.availability.content')}
              </p>
              <p className="text-sm text-muted-foreground">
                {t('terms.service.availability.maintenance')}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* User Responsibilities */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-3">
            <User className="h-6 w-6 text-primary" />
            <div>
              <CardTitle>{t('terms.responsibilities.title')}</CardTitle>
              <CardDescription>{t('terms.responsibilities.description')}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-primary">{t('terms.responsibilities.account.title')}</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start space-x-3">
                  <Shield className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-foreground">{t('terms.responsibilities.account.security.title')}</p>
                    <p>{t('terms.responsibilities.account.security.description')}</p>
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <User className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-foreground">{t('terms.responsibilities.account.accuracy.title')}</p>
                    <p>{t('terms.responsibilities.account.accuracy.description')}</p>
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <FileText className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-foreground">{t('terms.responsibilities.account.compliance.title')}</p>
                    <p>{t('terms.responsibilities.account.compliance.description')}</p>
                  </div>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold text-primary">{t('terms.responsibilities.prohibited.title')}</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start space-x-2">
                  <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                  <span>{t('terms.responsibilities.prohibited.unauthorized')}</span>
                </li>
                <li className="flex items-start space-x-2">
                  <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                  <span>{t('terms.responsibilities.prohibited.interference')}</span>
                </li>
                <li className="flex items-start space-x-2">
                  <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                  <span>{t('terms.responsibilities.prohibited.malicious')}</span>
                </li>
                <li className="flex items-start space-x-2">
                  <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                  <span>{t('terms.responsibilities.prohibited.violation')}</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Privacy and Data */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-3">
            <Shield className="h-6 w-6 text-primary" />
            <div>
              <CardTitle>{t('terms.privacy.title')}</CardTitle>
              <CardDescription>{t('terms.privacy.description')}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            {t('terms.privacy.content')}
          </p>
          <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
            <p className="text-sm text-muted-foreground">
              <strong className="text-primary">{t('terms.privacy.reference.title')}:</strong> {t('terms.privacy.reference.content')}
            </p>
            <a 
              href="/privacy" 
              className="text-primary hover:underline text-sm font-medium"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t('terms.privacy.reference.link')} →
            </a>
          </div>
        </CardContent>
      </Card>

      {/* Limitations and Disclaimers */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-3">
            <AlertTriangle className="h-6 w-6 text-primary" />
            <div>
              <CardTitle>{t('terms.limitations.title')}</CardTitle>
              <CardDescription>{t('terms.limitations.description')}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-semibold text-primary">{t('terms.limitations.liability.title')}</h4>
              <p className="text-sm text-muted-foreground">
                {t('terms.limitations.liability.content')}
              </p>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-primary">{t('terms.limitations.warranty.title')}</h4>
              <p className="text-sm text-muted-foreground">
                {t('terms.limitations.warranty.content')}
              </p>
            </div>
          </div>
          <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                  {t('terms.limitations.important.title')}
                </p>
                <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                  {t('terms.limitations.important.content')}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Termination */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-3">
            <Clock className="h-6 w-6 text-primary" />
            <div>
              <CardTitle>{t('terms.termination.title')}</CardTitle>
              <CardDescription>{t('terms.termination.description')}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            {t('terms.termination.content')}
          </p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start space-x-2">
              <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
              <span>{t('terms.termination.reasons.violation')}</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
              <span>{t('terms.termination.reasons.security')}</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
              <span>{t('terms.termination.reasons.discretion')}</span>
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* Contact and Changes */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-3">
            <FileText className="h-6 w-6 text-primary" />
            <div>
              <CardTitle>{t('terms.contact.title')}</CardTitle>
              <CardDescription>{t('terms.contact.description')}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-semibold text-primary">{t('terms.contact.support.title')}</h4>
              <div className="space-y-2 text-sm">
                <p className="text-muted-foreground">
                  {t('terms.contact.support.content')}
                </p>
                <div className="flex items-center space-x-2">
                  <span className="text-muted-foreground">{t('terms.contact.support.email')}:</span>
                  <a href="mailto:support@ads169th.com" className="text-primary hover:underline">
                    support@ads169th.com
                  </a>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-primary">{t('terms.contact.changes.title')}</h4>
              <p className="text-sm text-muted-foreground">
                {t('terms.contact.changes.content')}
              </p>
              <p className="text-sm text-muted-foreground">
                {t('terms.contact.changes.notification')}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Footer */}
      <div className="text-center text-sm text-muted-foreground border-t pt-6">
        <p>{t('terms.footer.version')}: 1.0 | {t('terms.footer.effective')}: {new Date().toLocaleDateString('th-TH')}</p>
        <p className="mt-2">{t('terms.footer.notice')}</p>
      </div>
    </div>
  )
}